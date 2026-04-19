import { describe, expect, it, vi } from "vitest";

import { createClient } from "../src/index.js";

describe("client.services.getAuthCredentials", () => {
  it("returns the unwrapped service auth credentials payload", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            password: "super-secret",
            username: "svc-user",
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

    await expect(client.services.getAuthCredentials("svc-1")).resolves.toEqual({
      password: "super-secret",
      username: "svc-user",
    });

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [url, init] = firstCall!;
    expect((url as URL).toString()).toBe(
      "https://reseller.example.test/api/v1/services/svc-1/auth/credentials",
    );
    expect(init?.method).toBe("GET");
  });

  it("sends the bearer token for authenticated service auth credentials requests", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            password: "super-secret",
            username: "svc-user",
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

    await client.services.getAuthCredentials("svc-1");

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [, init] = firstCall!;
    const headers = new Headers(init?.headers);
    expect(headers.get("authorization")).toBe("Bearer secret-token");
  });

  it("throws ApiError when the service auth credentials request fails", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: "NOT_FOUND",
            message: "Service not found",
          },
        }),
        {
          status: 404,
          headers: { "content-type": "application/json" },
        },
      ),
    );

    const client = createClient({
      baseUrl: "https://reseller.example.test",
      fetch: fetchMock,
    });

    await expect(
      client.services.getAuthCredentials("missing-service"),
    ).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      code: "NOT_FOUND",
      message: "Service not found",
    });
  });
});

describe("client.services.getProlongations", () => {
  it("returns the unwrapped service prolongations payload", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [
            {
              durationDays: 30,
              durationId: "duration-30",
              name: "30 Days",
              price: 19.99,
            },
          ],
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

    await expect(client.services.getProlongations("svc-1")).resolves.toEqual([
      {
        durationDays: 30,
        durationId: "duration-30",
        name: "30 Days",
        price: 19.99,
      },
    ]);

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [url, init] = firstCall!;
    expect((url as URL).toString()).toBe(
      "https://reseller.example.test/api/v1/services/svc-1/prolongations",
    );
    expect(init?.method).toBe("GET");
  });

  it("sends the bearer token for authenticated service prolongations requests", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const client = createClient({
      token: "secret-token",
      fetch: fetchMock,
    });

    await client.services.getProlongations("svc-1");

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [, init] = firstCall!;
    const headers = new Headers(init?.headers);
    expect(headers.get("authorization")).toBe("Bearer secret-token");
  });

  it("throws ApiError when the service prolongations request fails", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: "NOT_FOUND",
            message: "Service not found",
          },
        }),
        {
          status: 404,
          headers: { "content-type": "application/json" },
        },
      ),
    );

    const client = createClient({
      baseUrl: "https://reseller.example.test",
      fetch: fetchMock,
    });

    await expect(
      client.services.getProlongations("missing-service"),
    ).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      code: "NOT_FOUND",
      message: "Service not found",
    });
  });
});

describe("client.services.getProxyList", () => {
  it("returns the unwrapped proxy list payload", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [
            {
              ip: "192.0.2.10",
              password: "secret",
              port: 8080,
              username: "user-combined",
            },
          ],
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

    await expect(client.services.getProxyList("svc-1")).resolves.toEqual([
      {
        ip: "192.0.2.10",
        password: "secret",
        port: 8080,
        username: "user-combined",
      },
    ]);

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [url, init] = firstCall!;
    expect((url as URL).toString()).toBe(
      "https://reseller.example.test/api/v1/services/svc-1/proxy-list",
    );
    expect(init?.method).toBe("GET");
  });

  it("sends the bearer token for authenticated proxy list requests", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const client = createClient({
      token: "secret-token",
      fetch: fetchMock,
    });

    await client.services.getProxyList("svc-1");

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [, init] = firstCall!;
    const headers = new Headers(init?.headers);
    expect(headers.get("authorization")).toBe("Bearer secret-token");
  });

  it("throws ApiError when the proxy list request fails", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: "NOT_FOUND",
            message: "Service not found",
          },
        }),
        {
          status: 404,
          headers: { "content-type": "application/json" },
        },
      ),
    );

    const client = createClient({
      baseUrl: "https://reseller.example.test",
      fetch: fetchMock,
    });

    await expect(client.services.getProxyList("missing-service")).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      code: "NOT_FOUND",
      message: "Service not found",
    });
  });
});

describe("client.services.getBandwidth", () => {
  it("returns the unwrapped service bandwidth payload", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            bandwidth: {
              available: 70,
              total: 100,
              unit: "GB",
              used: 30,
            },
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

    await expect(client.services.getBandwidth("svc-1")).resolves.toEqual({
      bandwidth: {
        available: 70,
        total: 100,
        unit: "GB",
        used: 30,
      },
    });

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [url, init] = firstCall!;
    expect((url as URL).toString()).toBe(
      "https://reseller.example.test/api/v1/services/svc-1/bandwidth",
    );
    expect(init?.method).toBe("GET");
  });

  it("sends the bearer token for authenticated service bandwidth requests", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            bandwidth: {
              available: 70,
              total: 100,
              unit: "GB",
              used: 30,
            },
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

    await client.services.getBandwidth("svc-1");

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [, init] = firstCall!;
    const headers = new Headers(init?.headers);
    expect(headers.get("authorization")).toBe("Bearer secret-token");
  });

  it("throws ApiError when the service bandwidth request fails", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: "NOT_FOUND",
            message: "Service not found",
          },
        }),
        {
          status: 404,
          headers: { "content-type": "application/json" },
        },
      ),
    );

    const client = createClient({
      baseUrl: "https://reseller.example.test",
      fetch: fetchMock,
    });

    await expect(client.services.getBandwidth("missing-service")).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      code: "NOT_FOUND",
      message: "Service not found",
    });
  });
});

describe("client.services.get", () => {
  it("returns the unwrapped service payload", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
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

    await expect(client.services.get("svc-1")).resolves.toEqual({
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
    });

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [url, init] = firstCall!;
    expect((url as URL).toString()).toBe(
      "https://reseller.example.test/api/v1/services/svc-1",
    );
    expect(init?.method).toBe("GET");
  });

  it("sends the bearer token for authenticated service detail requests", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
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

    await client.services.get("svc-1");

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [, init] = firstCall!;
    const headers = new Headers(init?.headers);
    expect(headers.get("authorization")).toBe("Bearer secret-token");
  });

  it("throws ApiError when the service detail request fails", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: "NOT_FOUND",
            message: "Service not found",
          },
        }),
        {
          status: 404,
          headers: { "content-type": "application/json" },
        },
      ),
    );

    const client = createClient({
      baseUrl: "https://reseller.example.test",
      fetch: fetchMock,
    });

    await expect(client.services.get("missing-service")).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      code: "NOT_FOUND",
      message: "Service not found",
    });
  });
});

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
