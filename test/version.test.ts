import { describe, expect, it, vi } from "vitest";

import { createClient } from "../src/index.js";

describe("client.version.get", () => {
  it("returns the unwrapped version payload", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            name: "reseller-api",
            version: "0.2.0",
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    );

    const client = createClient({
      baseUrl: "https://reseller.example.test",
      fetch: fetchMock,
    });

    await expect(client.version.get()).resolves.toEqual({
      name: "reseller-api",
      version: "0.2.0",
    });

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [url, init] = firstCall!;
    expect((url as URL).toString()).toBe(
      "https://reseller.example.test/api/v1/version",
    );
    expect(init?.method).toBe("GET");
  });

  it("does not require a bearer token for version requests", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            name: "reseller-api",
            version: "0.2.0",
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    );

    const client = createClient({
      fetch: fetchMock,
    });

    await client.version.get();

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [, init] = firstCall!;
    const headers = new Headers(init?.headers);
    expect(headers.get("authorization")).toBeNull();
  });

  it("throws ApiError when the version request returns invalid API data", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({}), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const client = createClient({
      baseUrl: "https://reseller.example.test",
      fetch: fetchMock,
    });

    await expect(client.version.get()).rejects.toMatchObject({
      name: "ApiError",
      status: 200,
      message: "API response did not include data.",
    });
  });
});
