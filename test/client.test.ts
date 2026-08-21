import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ApiError,
  InvalidResponseError,
  TransportError,
  ValidationError,
  createClient,
} from "../src/index.js";

function response(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function client(fetchMock: typeof fetch) {
  return createClient({
    baseUrl: "https://example.test/root/",
    fetch: fetchMock,
    token: "secret",
  });
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("ResellerApiClient", () => {
  it("validates client options", () => {
    expect(() => createClient({ token: "" })).toThrow(ValidationError);
    expect(() => createClient({ token: "x", timeoutMs: 0 })).toThrow(
      ValidationError,
    );
    expect(() => createClient({ token: "x", baseUrl: "invalid" })).toThrow(
      TypeError,
    );
    expect(() => createClient({ token: "x", baseUrl: "file:///tmp" })).toThrow(
      TypeError,
    );
  });

  it("requests health with authentication and the configured base URL", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(response({ data: { status: "ok" } }));
    await expect(client(fetchMock).health.getHealth()).resolves.toEqual({
      status: "ok",
    });
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(String(url)).toBe("https://example.test/root/api/v1/health");
    expect(new Headers(init?.headers).get("authorization")).toBe(
      "Bearer secret",
    );
    expect(new Headers(init?.headers).get("accept")).toBe("application/json");
  });

  it("returns only the API version string", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        response({ data: { name: "reseller-api", version: "1.2.3" } }),
      );
    await expect(client(fetchMock).getApiVersion()).resolves.toBe("1.2.3");
  });

  it("exposes API error details and raw body", async () => {
    const body = JSON.stringify({
      error: { code: "NO_FUNDS", message: "Insufficient balance" },
    });
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(body, { status: 402 }));
    await expect(client(fetchMock).balance.getBalance()).rejects.toMatchObject({
      name: "ApiError",
      status: 402,
      code: "NO_FUNDS",
      message: "Insufficient balance",
      body,
    });
  });

  it("rejects malformed and incompatible successful responses", async () => {
    const malformed = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response("not json"));
    await expect(client(malformed).health.getHealth()).rejects.toBeInstanceOf(
      InvalidResponseError,
    );

    const incompatible = vi
      .fn<typeof fetch>()
      .mockResolvedValue(response({ data: { status: 1 } }));
    await expect(
      client(incompatible).health.getHealth(),
    ).rejects.toBeInstanceOf(InvalidResponseError);

    const missing = vi
      .fn<typeof fetch>()
      .mockResolvedValue(response({ error: false }));
    await expect(client(missing).health.getHealth()).rejects.toMatchObject({
      message: "API response did not include data.",
    });
  });

  it("retries retryable GET responses", async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response("", { status: 503 }))
      .mockResolvedValueOnce(response({ data: { status: "ok" } }));
    const result = client(fetchMock).health.getHealth();
    await vi.runAllTimersAsync();
    await expect(result).resolves.toEqual({ status: "ok" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries transport failures for GET and preserves the final cause", async () => {
    vi.useFakeTimers();
    const cause = new Error("offline");
    const fetchMock = vi.fn<typeof fetch>().mockRejectedValue(cause);
    const result = client(fetchMock)
      .health.getHealth()
      .catch((error: unknown) => error);
    await vi.runAllTimersAsync();
    const error = await result;
    expect(error).toBeInstanceOf(TransportError);
    expect((error as TransportError).cause).toBe(cause);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("does not retry mutating requests", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new Error("offline"));
    await expect(
      client(fetchMock).orders.create({
        items: [{ productId: "p", quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(TransportError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("accepts an empty successful response for void endpoints", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 204 }));
    await expect(
      client(fetchMock).services.update("service", { protocol: "http" }),
    ).resolves.toBeUndefined();
  });

  it("throws an ApiError for an API error inside a successful HTTP response", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(response({ error: { message: "failed" } }));
    await expect(client(fetchMock).health.getHealth()).rejects.toBeInstanceOf(
      ApiError,
    );
  });
});
