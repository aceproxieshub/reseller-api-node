import { describe, expect, it, vi } from "vitest";

import { createClient } from "../src/index.js";

describe("client.orders.list", () => {
  it("returns the unwrapped order list payload", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            items: [
              {
                createdAt: "2026-04-08T10:00:00Z",
                description: "Dedicated proxy order",
                id: "order-1",
                status: "active",
                total: {
                  amount: 12.5,
                  currency: "USD",
                },
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

    await expect(client.orders.list()).resolves.toEqual({
      items: [
        {
          createdAt: "2026-04-08T10:00:00Z",
          description: "Dedicated proxy order",
          id: "order-1",
          status: "active",
          total: {
            amount: 12.5,
            currency: "USD",
          },
        },
      ],
      limit: 20,
      page: 1,
    });

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [url, init] = firstCall!;
    expect((url as URL).toString()).toBe(
      "https://reseller.example.test/api/v1/orders",
    );
    expect(init?.method).toBe("GET");
  });

  it("sends the bearer token for authenticated order list requests", async () => {
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

    await client.orders.list();

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [, init] = firstCall!;
    const headers = new Headers(init?.headers);
    expect(headers.get("authorization")).toBe("Bearer secret-token");
  });

  it("throws ApiError when the order list request fails", async () => {
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

    await expect(client.orders.list()).rejects.toMatchObject({
      name: "ApiError",
      status: 401,
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  });
});

describe("client.orders.create", () => {
  it("sends the create order payload and returns the unwrapped response", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            createdAt: "2026-04-08T10:00:00Z",
            id: "order-1",
            status: "created",
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

    const payload = {
      items: [
        {
          productId: "f2c0f477-f3fa-4a60-af67-811cff1fdc72",
          durationId: "8f96443d-40ff-40f4-8d09-9932229cecc3",
          quantity: 1,
          options: {},
          addons: [],
        },
      ],
    };

    await expect(client.orders.create(payload)).resolves.toEqual({
      createdAt: "2026-04-08T10:00:00Z",
      id: "order-1",
      status: "created",
    });

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [url, init] = firstCall!;
    expect((url as URL).toString()).toBe(
      "https://reseller.example.test/api/v1/orders",
    );
    expect(init?.method).toBe("POST");

    const headers = new Headers(init?.headers);
    expect(headers.get("content-type")).toBe("application/json");
    expect(init?.body).toBe(JSON.stringify(payload));
  });

  it("sends the bearer token for authenticated create order requests", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            createdAt: "2026-04-08T10:00:00Z",
            id: "order-1",
            status: "created",
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

    await client.orders.create({
      items: [{ productId: "product-1", quantity: 1 }],
    });

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [, init] = firstCall!;
    const headers = new Headers(init?.headers);
    expect(headers.get("authorization")).toBe("Bearer secret-token");
  });

  it("throws ApiError when the create order request fails", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: "PAYMENT_REQUIRED",
            message: "Insufficient balance",
          },
        }),
        {
          status: 402,
          headers: { "content-type": "application/json" },
        },
      ),
    );

    const client = createClient({
      baseUrl: "https://reseller.example.test",
      fetch: fetchMock,
    });

    await expect(
      client.orders.create({
        items: [{ productId: "product-1", quantity: 1 }],
      }),
    ).rejects.toMatchObject({
      name: "ApiError",
      status: 402,
      code: "PAYMENT_REQUIRED",
      message: "Insufficient balance",
    });
  });
});
