import { describe, expect, it } from "vitest";
import {
  RotationInterval,
  createClient,
  type CreateOrderItem,
  type Protocol,
} from "../../src/index.js";

function environment(name: string): string {
  const value = process.env[name];
  if (value === undefined || value.trim() === "")
    throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function configValue(config: unknown, path: string): unknown {
  let value = config;
  for (const part of path.split(".")) {
    if (typeof value !== "object" || value === null || !(part in value))
      throw new Error(`Missing staging configuration value: ${path}`);
    value = (value as Record<string, unknown>)[part];
  }
  return value;
}

function stringValue(config: unknown, path: string): string {
  const value = configValue(config, path);
  if (typeof value !== "string" || value.trim() === "")
    throw new Error(`Expected a non-empty string at: ${path}`);
  return value;
}

function numberValue(config: unknown, path: string): number {
  const value = configValue(config, path);
  if (typeof value !== "number" || !Number.isInteger(value))
    throw new Error(`Expected an integer at: ${path}`);
  return value;
}

describe("staging API contract", () => {
  const confirmation = environment("ACEPROXIES_STAGING_CONFIRM");
  if (confirmation !== "staging-only")
    throw new Error("Staging confirmation is missing.");
  const baseUrl = environment("ACEPROXIES_STAGING_BASE_URL");
  if (new URL(baseUrl).hostname === "reseller.aceproxies.com")
    throw new Error("The staging suite refuses to target production.");
  const config: unknown = JSON.parse(environment("ACEPROXIES_STAGING_CONFIG"));
  const api = createClient({
    baseUrl,
    token: environment("ACEPROXIES_STAGING_TOKEN"),
  });

  it("verifies every read-only operation", async () => {
    await expect(api.health.getHealth()).resolves.toHaveProperty("status");
    await expect(api.getApiVersion()).resolves.not.toBe("");
    await expect(api.balance.getBalance()).resolves.toHaveProperty("currency");
    await expect(api.orders.list({ limit: 1 })).resolves.toHaveProperty(
      "items",
    );
    await expect(
      api.orders.find(stringValue(config, "orderId")),
    ).resolves.not.toBeNull();
    await expect(api.products.list()).resolves.toBeInstanceOf(Array);
    await expect(api.products.types()).resolves.toHaveProperty("types");

    const services = api.services;
    await expect(services.list({ limit: 1 })).resolves.toHaveProperty("items");
    await expect(
      services.find(stringValue(config, "services.detail")),
    ).resolves.not.toBeNull();
    await expect(
      services.getBandwidth(stringValue(config, "services.bandwidth")),
    ).resolves.not.toBeNull();
    await expect(
      services.getCredentials(stringValue(config, "services.credentials")),
    ).resolves.not.toBeNull();
    await expect(
      services.getWhitelistedIps(stringValue(config, "services.whitelist")),
    ).resolves.toBeInstanceOf(Array);
    const replacementCode = stringValue(config, "services.ipReplacement");
    await expect(
      services.getIpReplacements(replacementCode),
    ).resolves.toBeInstanceOf(Array);
    await expect(
      services.getAvailableIpReplacements(replacementCode),
    ).resolves.toHaveProperty("count");
    await expect(
      services.getIpReplacementCount(replacementCode),
    ).resolves.toHaveProperty("count");
    await expect(
      services.getIpReplacementLocations(replacementCode),
    ).resolves.toHaveProperty("locations");
    await expect(
      services.getProlongations(stringValue(config, "services.prolongation")),
    ).resolves.toBeInstanceOf(Array);
    await expect(
      services.getProxyList(stringValue(config, "services.proxyList")),
    ).resolves.toBeInstanceOf(Array);

    const residentialCode = stringValue(config, "residential.serviceCode");
    const requestId = stringValue(config, "residential.proxyRequestId");
    await expect(services.residential.countries()).resolves.toBeInstanceOf(
      Array,
    );
    await expect(services.residential.rotationIntervals()).resolves.toBeTypeOf(
      "object",
    );
    await expect(
      services.residential.proxyRequests(residentialCode),
    ).resolves.toBeInstanceOf(Array);
    await expect(
      services.residential.findProxyRequest(residentialCode, requestId),
    ).resolves.not.toBeNull();
    await expect(
      services.residential.getProxyList(residentialCode, requestId),
    ).resolves.toBeInstanceOf(Array);
  });

  it.runIf(process.env.ACEPROXIES_STAGING_MODE === "full")(
    "verifies mutating operations",
    async () => {
      const item: CreateOrderItem = {
        productId: stringValue(config, "mutations.order.productId"),
        quantity: numberValue(config, "mutations.order.quantity"),
      };
      await expect(
        api.orders.create({ items: [item] }),
      ).resolves.toHaveProperty("id");
      await expect(
        api.services.update(
          stringValue(config, "mutations.update.serviceCode"),
          {
            protocol: stringValue(
              config,
              "mutations.update.protocol",
            ) as Protocol,
          },
        ),
      ).resolves.toBeUndefined();
      await expect(
        api.services.updateCredentials(
          stringValue(config, "mutations.credentials.serviceCode"),
          {
            password: stringValue(config, "mutations.credentials.password"),
          },
        ),
      ).resolves.toHaveProperty("password");

      const whitelistCode = stringValue(
        config,
        "mutations.whitelist.serviceCode",
      );
      const ip = stringValue(config, "mutations.whitelist.ip");
      await api.services.addWhitelistedIp(whitelistCode, { ip });
      await api.services.deleteWhitelistedIp(whitelistCode, ip);
      await expect(
        api.services.createIpReplacement(
          stringValue(config, "mutations.ipReplacement.serviceCode"),
        ),
      ).resolves.toHaveProperty("uuid");
      await expect(
        api.services.createProlongation(
          stringValue(config, "mutations.prolongation.serviceCode"),
          {
            durationId: stringValue(
              config,
              "mutations.prolongation.durationId",
            ),
            quantity: numberValue(config, "mutations.prolongation.quantity"),
          },
        ),
      ).resolves.toHaveProperty("durationId");

      const residentialCode = stringValue(
        config,
        "mutations.residential.serviceCode",
      );
      const created = await api.services.residential.createProxyRequest(
        residentialCode,
        {
          countryId: numberValue(config, "mutations.residential.countryId"),
          proxyCount: numberValue(config, "mutations.residential.proxyCount"),
          rotationInterval: stringValue(
            config,
            "mutations.residential.rotationInterval",
          ) as RotationInterval,
        },
      );
      await expect(
        api.services.residential.deleteProxyRequest(
          residentialCode,
          created.id,
        ),
      ).resolves.toHaveProperty("id");
    },
  );
});
