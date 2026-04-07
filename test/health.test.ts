import { describe, expect, it, vi } from "vitest";

import { createClient } from "../src/index.js";

describe("client.health.check", () => {
  it("uses the default base URL when baseUrl is omitted", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ data: { status: "ok" } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const client = createClient({
      fetch: fetchMock,
    });

    await client.health.check();

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [url] = firstCall!;
    expect((url as URL).toString()).toBe("https://reseller.aceproxies.com/api/v1/health");
  });

  it("returns the unwrapped health payload", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ data: { status: "ok" } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const client = createClient({
      baseUrl: "https://reseller.example.test",
      fetch: fetchMock,
    });

    await expect(client.health.check()).resolves.toEqual({ status: "ok" });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [url, init] = firstCall!;
    expect(url).toBeInstanceOf(URL);
    expect((url as URL).toString()).toBe(
      "https://reseller.example.test/api/v1/health",
    );
    expect(init?.method).toBe("GET");
  });

  it("sends the bearer token when provided", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ data: { status: "ok" } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const client = createClient({
      baseUrl: "https://reseller.example.test",
      token: "secret-token",
      fetch: fetchMock,
    });

    await client.health.check();

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [, init] = firstCall!;
    const headers = new Headers(init?.headers);
    expect(headers.get("authorization")).toBe("Bearer secret-token");
    expect(headers.get("accept")).toBe("application/json");
  });

  it("throws ApiError when the API returns an error payload", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: "UNAUTHORIZED",
            message: "Unauthorized",
          },
        }),
        {
          status: 401,
          headers: { "content-type": "application/json" },
        },
      ),
    );

    const client = createClient({
      baseUrl: "https://reseller.example.test",
      fetch: fetchMock,
    });

    await expect(client.health.check()).rejects.toMatchObject({
      name: "ApiError",
      status: 401,
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  });
});
