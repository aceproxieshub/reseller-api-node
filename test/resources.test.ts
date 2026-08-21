import { describe, expect, it, vi } from "vitest";
import {
  RotationInterval,
  ValidationError,
  createClient,
} from "../src/index.js";

function response(data: unknown, status = 200): Response {
  return new Response(JSON.stringify({ data }), { status });
}

function setup(data: unknown, status = 200) {
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValue(response(data, status));
  return {
    api: createClient({
      baseUrl: "https://example.test",
      fetch: fetchMock,
      token: "token",
    }),
    fetchMock,
  };
}

describe("orders and products", () => {
  it("lists and finds typed orders with pagination and encoded IDs", async () => {
    const order = {
      id: "order/1",
      status: "paid",
      description: "Order",
      total: { amount: 12.5, currency: "USD" },
      createdAt: "2026-01-01T00:00:00Z",
      isRecurring: false,
    };
    const listed = setup({ items: [order], page: 2, limit: 5 });
    await expect(
      listed.api.orders.list({ page: 2, limit: 5 }),
    ).resolves.toEqual({ items: [order], page: 2, limit: 5 });
    expect(String(listed.fetchMock.mock.calls[0]?.[0])).toContain(
      "?page=2&limit=5",
    );

    const found = setup(order);
    await expect(found.api.orders.find("order/1")).resolves.toEqual(order);
    expect(String(found.fetchMock.mock.calls[0]?.[0])).toContain(
      "orders/order%2F1",
    );
  });

  it("returns null for missing orders and validates order requests", async () => {
    await expect(setup({}, 404).api.orders.find("missing")).resolves.toBeNull();
    const api = setup({}).api;
    expect(() => api.orders.list({ page: 0 })).toThrow(ValidationError);
    expect(() => api.orders.create({ items: [] })).toThrow(ValidationError);
    expect(() =>
      api.orders.create({ items: [{ productId: "", quantity: 1 }] }),
    ).toThrow(ValidationError);
    expect(() =>
      api.orders.create({ items: [{ productId: "p", quantity: 0 }] }),
    ).toThrow(ValidationError);
  });

  it("decodes current products and product types", async () => {
    const product = {
      id: "p",
      name: "Residential",
      type: "resi",
      addons: {},
      options: { country: true },
      price: null,
      durations: [{ id: "d", name: "Month", durationDays: 30, price: 10 }],
    };
    await expect(setup([product]).api.products.list()).resolves.toEqual([
      product,
    ]);
    await expect(
      setup({ types: ["resi"] }).api.products.types(),
    ).resolves.toEqual({ types: ["resi"] });
  });
});

describe("services", () => {
  it("lists summaries and finds full details", async () => {
    const summary = { code: "s", orderId: "o", status: "active" };
    await expect(
      setup({ items: [summary], page: 1, limit: 10 }).api.services.list(),
    ).resolves.toEqual({
      items: [
        {
          ...summary,
          amount: null,
          auth: null,
          createdAt: null,
          startedAt: null,
          expiredAt: null,
        },
      ],
      page: 1,
      limit: 10,
    });
    const detail = {
      amount: { amount: 1, unit: "GB" },
      auth: { method: "password" },
      code: "s",
      createdAt: "2026-01-01T00:00:00Z",
      expiresAt: null,
      isRecurring: false,
      orderId: 1,
      orderUuid: "o",
      price: { amount: 10, currency: "USD" },
      protocol: "http",
      serviceType: "dc_proxy",
      startedAt: null,
      status: "active",
      userId: "u",
    };
    await expect(setup(detail).api.services.find("s")).resolves.toEqual(detail);
    await expect(setup({}, 404).api.services.find("s")).resolves.toBeNull();
  });

  it("covers service reads", async () => {
    await expect(
      setup({
        bandwidth: { available: 1.5, total: 10, unit: "GB", used: 8.5 },
      }).api.services.getBandwidth("s"),
    ).resolves.toMatchObject({ bandwidth: { total: 10 } });
    await expect(
      setup({ username: "u", password: "p" }).api.services.getCredentials("s"),
    ).resolves.toEqual({ username: "u", password: "p" });
    await expect(
      setup([{ ip: "192.0.2.1" }]).api.services.getWhitelistedIps("s"),
    ).resolves.toEqual([{ ip: "192.0.2.1", description: null }]);
    const replacement = {
      createdAt: "2026-01-01T00:00:00Z",
      replacedAt: null,
      status: "pending",
      uuid: "r",
    };
    await expect(
      setup([replacement]).api.services.getIpReplacements("s"),
    ).resolves.toEqual([replacement]);
    await expect(
      setup({ count: 2 }).api.services.getAvailableIpReplacements("s"),
    ).resolves.toEqual({ count: 2 });
    await expect(
      setup({ count: 3 }).api.services.getIpReplacementCount("s"),
    ).resolves.toEqual({ count: 3 });
    await expect(
      setup({
        locations: [{ country: "DE", id: "de-1", location: "Berlin" }],
      }).api.services.getIpReplacementLocations("s"),
    ).resolves.toMatchObject({ locations: [{ country: "DE" }] });
    await expect(
      setup([
        { durationDays: 30, durationId: "d", name: "Month", price: 10 },
      ]).api.services.getProlongations("s"),
    ).resolves.toHaveLength(1);
    await expect(
      setup([
        { ip: "192.0.2.2", password: "p", port: 8000, username: "u" },
      ]).api.services.getProxyList("s"),
    ).resolves.toHaveLength(1);
  });

  it("covers service mutations and validates inputs", async () => {
    const credentials = setup({ username: "u", password: "p" });
    await credentials.api.services.updateCredentials("s/1", { password: "p" });
    expect(String(credentials.fetchMock.mock.calls[0]?.[0])).toContain(
      "services/s%2F1/auth/credentials",
    );
    await expect(
      setup({ ip: "192.0.2.1" }).api.services.addWhitelistedIp("s", {
        ip: "192.0.2.1",
      }),
    ).resolves.toMatchObject({ ip: "192.0.2.1" });
    await expect(
      setup({
        createdAt: "2026-01-01T00:00:00Z",
        replacedAt: null,
        status: "pending",
        uuid: "r",
      }).api.services.createIpReplacement("s"),
    ).resolves.toMatchObject({ uuid: "r" });
    await expect(
      setup({
        durationId: "d",
        newExpirationDate: "2026-02-01T00:00:00Z",
        quantity: 1,
        status: "created",
      }).api.services.createProlongation("s", { durationId: "d", quantity: 1 }),
    ).resolves.toMatchObject({ durationId: "d" });
    expect(() => setup({}).api.services.update("s", {})).toThrow(
      ValidationError,
    );
    expect(() =>
      setup({}).api.services.addWhitelistedIp("s", { ip: "bad" }),
    ).toThrow(ValidationError);
    expect(() =>
      setup({}).api.services.createProlongation("s", {
        durationId: "",
        quantity: 1,
      }),
    ).toThrow(ValidationError);
  });
});

describe("residential services", () => {
  const proxyRequest = {
    id: "r",
    countryId: 1,
    proxyCount: 2,
    rotationInterval: "all",
    status: "active",
    updatedAt: "2026-01-02T00:00:00Z",
    createdAt: "2026-01-01T00:00:00Z",
  };

  it("covers residential reads", async () => {
    await expect(
      setup([
        { id: 1, name: "Germany", rotationIntervals: ["all"] },
      ]).api.services.residential.countries(),
    ).resolves.toHaveLength(1);
    await expect(
      setup({
        all: "Per request",
      }).api.services.residential.rotationIntervals(),
    ).resolves.toEqual({ all: "Per request" });
    await expect(
      setup([proxyRequest]).api.services.residential.proxyRequests("s"),
    ).resolves.toEqual([proxyRequest]);
    await expect(
      setup(proxyRequest).api.services.residential.findProxyRequest("s", "r"),
    ).resolves.toEqual(proxyRequest);
    await expect(
      setup({}, 404).api.services.residential.findProxyRequest("s", "r"),
    ).resolves.toBeNull();
    await expect(
      setup([
        { ip: "192.0.2.3", password: "p", port: 9000, username: "u" },
      ]).api.services.residential.getProxyList("s", "r"),
    ).resolves.toHaveLength(1);
  });

  it("creates and deletes residential proxy requests", async () => {
    await expect(
      setup(proxyRequest).api.services.residential.createProxyRequest("s", {
        countryId: 1,
        proxyCount: 2,
        rotationInterval: RotationInterval.All,
      }),
    ).resolves.toEqual(proxyRequest);
    await expect(
      setup(proxyRequest).api.services.residential.deleteProxyRequest("s", "r"),
    ).resolves.toEqual(proxyRequest);
    expect(() =>
      setup({}).api.services.residential.createProxyRequest("s", {
        countryId: 0,
        proxyCount: 1,
        rotationInterval: RotationInterval.All,
      }),
    ).toThrow(ValidationError);
  });
});
