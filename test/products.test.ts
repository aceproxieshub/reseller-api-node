import { describe, expect, it, vi } from "vitest";

import { createClient } from "../src/index.js";

describe("client.products.getTypes", () => {
  it("returns the unwrapped product types payload", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({ data: { types: ["mobile", "residential"] } }),
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

    await expect(client.products.getTypes()).resolves.toEqual({
      types: ["mobile", "residential"],
    });

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [url, init] = firstCall!;
    expect((url as URL).toString()).toBe(
      "https://reseller.example.test/api/v1/products/types",
    );
    expect(init?.method).toBe("GET");
  });

  it("sends the bearer token for authenticated product types requests", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ data: { types: ["mobile"] } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const client = createClient({
      token: "secret-token",
      fetch: fetchMock,
    });

    await client.products.getTypes();

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [, init] = firstCall!;
    const headers = new Headers(init?.headers);
    expect(headers.get("authorization")).toBe("Bearer secret-token");
  });

  it("throws ApiError when the product types request fails", async () => {
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

    await expect(client.products.getTypes()).rejects.toMatchObject({
      name: "ApiError",
      status: 401,
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  });
});
