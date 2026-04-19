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

describe("client.services.updateAuthCredentials", () => {
  it("returns the unwrapped updated service auth credentials payload", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            password: "new-secret",
            username: "new-user",
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

    await expect(
      client.services.updateAuthCredentials("svc-1", {
        password: "new-secret",
        username: "new-user",
      }),
    ).resolves.toEqual({
      password: "new-secret",
      username: "new-user",
    });

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [url, init] = firstCall!;
    expect((url as URL).toString()).toBe(
      "https://reseller.example.test/api/v1/services/svc-1/auth/credentials",
    );
    expect(init?.method).toBe("PUT");

    const headers = new Headers(init?.headers);
    expect(headers.get("content-type")).toBe("application/json");
    expect(init?.body).toBe(
      JSON.stringify({
        password: "new-secret",
        username: "new-user",
      }),
    );
  });

  it("sends the bearer token for authenticated service auth credentials updates", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            password: "new-secret",
            username: "new-user",
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

    await client.services.updateAuthCredentials("svc-1", {
      password: "new-secret",
      username: "new-user",
    });

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [, init] = firstCall!;
    const headers = new Headers(init?.headers);
    expect(headers.get("authorization")).toBe("Bearer secret-token");
  });

  it("throws ApiError when the service auth credentials update fails", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: "CONFLICT",
            message: "Credentials already in use",
          },
        }),
        {
          status: 409,
          headers: { "content-type": "application/json" },
        },
      ),
    );

    const client = createClient({
      baseUrl: "https://reseller.example.test",
      fetch: fetchMock,
    });

    await expect(
      client.services.updateAuthCredentials("svc-1", {
        password: "new-secret",
        username: "new-user",
      }),
    ).rejects.toMatchObject({
      name: "ApiError",
      status: 409,
      code: "CONFLICT",
      message: "Credentials already in use",
    });
  });
});

describe("client.services.getAuthWhitelistedIps", () => {
  it("returns the unwrapped service auth whitelisted IPs payload", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [
            {
              description: "Office",
              ip: "203.0.113.10",
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

    await expect(client.services.getAuthWhitelistedIps("svc-1")).resolves.toEqual([
      {
        description: "Office",
        ip: "203.0.113.10",
      },
    ]);

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [url, init] = firstCall!;
    expect((url as URL).toString()).toBe(
      "https://reseller.example.test/api/v1/services/svc-1/auth/whitelisted-ips",
    );
    expect(init?.method).toBe("GET");
  });

  it("sends the bearer token for authenticated service auth whitelisted IP requests", async () => {
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

    await client.services.getAuthWhitelistedIps("svc-1");

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [, init] = firstCall!;
    const headers = new Headers(init?.headers);
    expect(headers.get("authorization")).toBe("Bearer secret-token");
  });

  it("throws ApiError when the service auth whitelisted IP request fails", async () => {
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
      client.services.getAuthWhitelistedIps("missing-service"),
    ).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      code: "NOT_FOUND",
      message: "Service not found",
    });
  });
});

describe("client.services.deleteAuthWhitelistedIp", () => {
  it("deletes the service auth whitelisted IP", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ error: false }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const client = createClient({
      baseUrl: "https://reseller.example.test",
      fetch: fetchMock,
    });

    await expect(
      client.services.deleteAuthWhitelistedIp("svc-1", "203.0.113.10"),
    ).resolves.toBeUndefined();

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [url, init] = firstCall!;
    expect((url as URL).toString()).toBe(
      "https://reseller.example.test/api/v1/services/svc-1/auth/whitelisted-ips/203.0.113.10",
    );
    expect(init?.method).toBe("DELETE");
  });

  it("sends the bearer token for authenticated service auth whitelisted IP deletes", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ error: false }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const client = createClient({
      token: "secret-token",
      fetch: fetchMock,
    });

    await client.services.deleteAuthWhitelistedIp("svc-1", "203.0.113.10");

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [, init] = firstCall!;
    const headers = new Headers(init?.headers);
    expect(headers.get("authorization")).toBe("Bearer secret-token");
  });

  it("throws ApiError with the patch response message when the delete fails", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: true,
          message: "Whitelisted IP not found",
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
      client.services.deleteAuthWhitelistedIp("svc-1", "203.0.113.10"),
    ).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      message: "Whitelisted IP not found",
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
