import { describe, expect, it, vi } from "vitest";

import { createClient } from "../src/index.js";

describe("client.services.list", () => {
  it("returns the unwrapped service list payload", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            items: [
              {
                amount: {
                  amount: 5,
                  unit: "GB",
                },
                code: "svc-1",
                createdAt: "2026-04-08T10:00:00Z",
                expiredAt: "2026-05-08T10:00:00Z",
                orderId: "order-1",
                startedAt: "2026-04-08T10:00:00Z",
                status: "active",
              },
            ],
            limit: 20,
            page: 1,
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

    await expect(client.services.list()).resolves.toEqual({
      items: [
        {
          amount: {
            amount: 5,
            unit: "GB",
          },
          code: "svc-1",
          createdAt: "2026-04-08T10:00:00Z",
          expiredAt: "2026-05-08T10:00:00Z",
          orderId: "order-1",
          startedAt: "2026-04-08T10:00:00Z",
          status: "active",
        },
      ],
      limit: 20,
      page: 1,
    });

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [url, init] = firstCall!;
    expect((url as URL).toString()).toBe(
      "https://reseller.example.test/api/v1/services",
    );
    expect(init?.method).toBe("GET");
  });

  it("sends the bearer token for authenticated service list requests", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            items: [],
            limit: 20,
            page: 1,
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    );

    const client = createClient({
      token: "secret-token",
      fetch: fetchMock,
    });

    await client.services.list();

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [, init] = firstCall!;
    const headers = new Headers(init?.headers);
    expect(headers.get("authorization")).toBe("Bearer secret-token");
  });

  it("throws ApiError when the service list request fails", async () => {
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

    await expect(client.services.list()).rejects.toMatchObject({
      name: "ApiError",
      status: 401,
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  });
});
