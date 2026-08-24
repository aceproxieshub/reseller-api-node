import { InvalidResponseError } from "./errors.js";
import type { BalanceResponse } from "./resources/balance.types.js";
import type { HealthResponse } from "./resources/health.types.js";
import type {
  CreateOrderResponse,
  Money,
  OrderListResponse,
  OrderResponse,
} from "./resources/orders.types.js";
import type {
  Product,
  ProductDuration,
  ProductTypesResponse,
} from "./resources/products.types.js";
import type {
  ResidentialCountry,
  ResidentialProxy,
  ResidentialProxyRequest,
  ResidentialRotationIntervals,
} from "./resources/residential.types.js";
import type {
  CreateProlongationResponse,
  ServiceAmount,
  ServiceAuth,
  ServiceBandwidthResponse,
  ServiceCredentials,
  ServiceDetail,
  ServiceIpReplacement,
  ServiceIpReplacementCount,
  ServiceIpReplacementLocations,
  ServiceIpReplacementLocation,
  ServiceListResponse,
  ServicePrice,
  ServiceProlongation,
  ServiceProxy,
  ServiceSummary,
  ServiceWhitelistedIp,
} from "./resources/services.types.js";
import type { VersionResponse } from "./resources/version.types.js";

type ObjectValue = Record<string, unknown>;

function fail(message: string): never {
  throw new TypeError(message);
}

function object(value: unknown, name: string): ObjectValue {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return fail(`${name} must be an object.`);
  }
  return value as ObjectValue;
}

function array(value: unknown, name: string): unknown[] {
  if (!Array.isArray(value)) return fail(`${name} must be an array.`);
  return value;
}

function string(value: unknown, name: string): string {
  if (typeof value !== "string") return fail(`${name} must be a string.`);
  return value;
}

function number(value: unknown, name: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fail(`${name} must be a finite number.`);
  }
  return value;
}

function integer(value: unknown, name: string): number {
  const result = number(value, name);
  if (!Number.isInteger(result)) return fail(`${name} must be an integer.`);
  return result;
}

function boolean(value: unknown, name: string): boolean {
  if (typeof value !== "boolean") return fail(`${name} must be a boolean.`);
  return value;
}

function date(value: unknown, name: string): string {
  const result = string(value, name);
  if (!Number.isFinite(Date.parse(result)))
    return fail(`${name} must be a date.`);
  return result;
}

function nullableDate(value: unknown, name: string): string | null {
  return value === null || typeof value === "undefined"
    ? null
    : date(value, name);
}

function nullableString(value: unknown, name: string): string | null {
  return value === null || typeof value === "undefined"
    ? null
    : string(value, name);
}

function list<T>(
  value: unknown,
  name: string,
  decoder: (item: unknown) => T,
): T[] {
  return array(value, name).map(decoder);
}

function stringList(value: unknown, name: string): string[] {
  return list(value, name, (item) => string(item, `${name} item`));
}

function money(value: unknown): Money {
  const data = object(value, "money");
  return {
    amount: number(data.amount, "money.amount"),
    currency: string(data.currency, "money.currency"),
  };
}

function serviceAmount(value: unknown): ServiceAmount {
  const data = object(value, "service amount");
  return {
    amount: integer(data.amount, "service amount.amount"),
    unit: string(data.unit, "service amount.unit"),
  };
}

function serviceAuth(value: unknown): ServiceAuth {
  const data = object(value, "service auth");
  return { method: string(data.method, "service auth.method") };
}

function servicePrice(value: unknown): ServicePrice {
  const data = object(value, "service price");
  return {
    amount: number(data.amount, "service price.amount"),
    currency: string(data.currency, "service price.currency"),
  };
}

export function decodeHealth(value: unknown): HealthResponse {
  const data = object(value, "health response");
  return { status: string(data.status, "health.status") };
}

export function decodeBalance(value: unknown): BalanceResponse {
  const data = object(value, "balance response");
  return {
    balance: number(data.balance, "balance.balance"),
    currency: string(data.currency, "balance.currency"),
  };
}

export function decodeVersion(value: unknown): VersionResponse {
  const data = object(value, "version response");
  return {
    name: string(data.name, "version.name"),
    version: string(data.version, "version.version"),
  };
}

export function decodeOrder(value: unknown): OrderResponse {
  const data = object(value, "order");
  return {
    createdAt: date(data.createdAt, "order.createdAt"),
    description: string(data.description, "order.description"),
    id: string(data.id, "order.id"),
    isRecurring: boolean(data.isRecurring, "order.isRecurring"),
    status: string(data.status, "order.status"),
    total: money(data.total),
  };
}

export function decodeOrderList(value: unknown): OrderListResponse {
  const data = object(value, "order list");
  return {
    items: list(data.items, "order list.items", decodeOrder),
    limit: integer(data.limit, "order list.limit"),
    page: integer(data.page, "order list.page"),
  };
}

export function decodeCreateOrder(value: unknown): CreateOrderResponse {
  const data = object(value, "create order response");
  return {
    createdAt: date(data.createdAt, "order.createdAt"),
    id: string(data.id, "order.id"),
    status: string(data.status, "order.status"),
  };
}

function productDuration(value: unknown): ProductDuration {
  const data = object(value, "product duration");
  return {
    durationDays: integer(data.durationDays, "duration.durationDays"),
    id: string(data.id, "duration.id"),
    name: string(data.name, "duration.name"),
    price: number(data.price, "duration.price"),
  };
}

function product(value: unknown): Product {
  const data = object(value, "product");
  return {
    addons: data.addons,
    durations:
      data.durations === null
        ? null
        : list(data.durations, "product.durations", productDuration),
    id: string(data.id, "product.id"),
    name: string(data.name, "product.name"),
    options: object(data.options, "product.options"),
    price: data.price === null ? null : number(data.price, "product.price"),
    type: string(data.type, "product.type"),
  };
}

export function decodeProducts(value: unknown): Product[] {
  return list(value, "products", product);
}

export function decodeProductTypes(value: unknown): ProductTypesResponse {
  const data = object(value, "product types");
  return { types: stringList(data.types, "product types.types") };
}

function serviceSummary(value: unknown): ServiceSummary {
  const data = object(value, "service summary");
  return {
    amount:
      data.amount === null || typeof data.amount === "undefined"
        ? null
        : serviceAmount(data.amount),
    auth:
      data.auth === null || typeof data.auth === "undefined"
        ? null
        : serviceAuth(data.auth),
    code: string(data.code, "service.code"),
    createdAt: nullableDate(data.createdAt, "service.createdAt"),
    expiredAt: nullableDate(data.expiredAt, "service.expiredAt"),
    orderId: string(data.orderId, "service.orderId"),
    startedAt: nullableDate(data.startedAt, "service.startedAt"),
    status: string(data.status, "service.status"),
    type:
      data.type === null || typeof data.type === "undefined"
        ? null
        : string(data.type, "service.type"),
  };
}

export function decodeServiceList(value: unknown): ServiceListResponse {
  const data = object(value, "service list");
  return {
    items: list(data.items, "service list.items", serviceSummary),
    limit: integer(data.limit, "service list.limit"),
    page: integer(data.page, "service list.page"),
  };
}

export function decodeServiceDetail(value: unknown): ServiceDetail {
  const data = object(value, "service detail");
  return {
    amount: serviceAmount(data.amount),
    auth: serviceAuth(data.auth),
    code: string(data.code, "service.code"),
    createdAt: date(data.createdAt, "service.createdAt"),
    expiresAt: nullableDate(data.expiresAt, "service.expiresAt"),
    isRecurring: boolean(data.isRecurring, "service.isRecurring"),
    orderId: integer(data.orderId, "service.orderId"),
    orderUuid: string(data.orderUuid, "service.orderUuid"),
    price: servicePrice(data.price),
    protocol: string(data.protocol, "service.protocol"),
    serviceType: string(data.type ?? data.serviceType, "service.type"),
    startedAt: nullableDate(data.startedAt, "service.startedAt"),
    status: string(data.status, "service.status"),
    type: string(data.type ?? data.serviceType, "service.type"),
    userId: string(data.userId, "service.userId"),
  };
}

export function decodeBandwidth(value: unknown): ServiceBandwidthResponse {
  const data = object(value, "bandwidth response");
  const bandwidth = object(data.bandwidth, "bandwidth");
  return {
    bandwidth: {
      available: number(bandwidth.available, "bandwidth.available"),
      total: integer(bandwidth.total, "bandwidth.total"),
      unit: string(bandwidth.unit, "bandwidth.unit"),
      used: number(bandwidth.used, "bandwidth.used"),
    },
  };
}

export function decodeCredentials(value: unknown): ServiceCredentials {
  const data = object(value, "credentials");
  return {
    password: string(data.password, "credentials.password"),
    username: string(data.username, "credentials.username"),
  };
}

function whitelistedIp(value: unknown): ServiceWhitelistedIp {
  const data = object(value, "whitelisted IP");
  return {
    description: nullableString(data.description, "whitelisted IP.description"),
    ip: string(data.ip, "whitelisted IP.ip"),
  };
}

export function decodeWhitelistedIps(value: unknown): ServiceWhitelistedIp[] {
  return list(value, "whitelisted IPs", whitelistedIp);
}
export const decodeWhitelistedIp = whitelistedIp;

function ipReplacement(value: unknown): ServiceIpReplacement {
  const data = object(value, "IP replacement");
  return {
    createdAt: date(data.createdAt, "replacement.createdAt"),
    replacedAt: nullableDate(data.replacedAt, "replacement.replacedAt"),
    status: string(data.status, "replacement.status"),
    uuid: string(data.uuid, "replacement.uuid"),
  };
}

export function decodeIpReplacements(value: unknown): ServiceIpReplacement[] {
  return list(value, "IP replacements", ipReplacement);
}
export const decodeIpReplacement = ipReplacement;

export function decodeIpReplacementCount(
  value: unknown,
): ServiceIpReplacementCount {
  const data = object(value, "IP replacement count");
  return { count: integer(data.count, "IP replacement count.count") };
}

function ipReplacementLocation(value: unknown): ServiceIpReplacementLocation {
  const data = object(value, "IP replacement location");
  return {
    country: string(data.country, "location.country"),
    id: string(data.id, "location.id"),
    location: string(data.location, "location.location"),
  };
}

export function decodeIpReplacementLocations(
  value: unknown,
): ServiceIpReplacementLocations {
  const data = object(value, "IP replacement locations");
  return {
    locations: list(
      data.locations,
      "IP replacement locations.locations",
      ipReplacementLocation,
    ),
  };
}

function prolongation(value: unknown): ServiceProlongation {
  const data = object(value, "prolongation");
  return {
    durationDays: integer(data.durationDays, "prolongation.durationDays"),
    durationId: string(data.durationId, "prolongation.durationId"),
    name: string(data.name, "prolongation.name"),
    price: number(data.price, "prolongation.price"),
  };
}

export function decodeProlongations(value: unknown): ServiceProlongation[] {
  return list(value, "prolongations", prolongation);
}

export function decodeCreateProlongation(
  value: unknown,
): CreateProlongationResponse {
  const data = object(value, "create prolongation response");
  return {
    durationId: string(data.durationId, "prolongation.durationId"),
    newExpirationDate: date(
      data.newExpirationDate,
      "prolongation.newExpirationDate",
    ),
    quantity: integer(data.quantity, "prolongation.quantity"),
    status: string(data.status, "prolongation.status"),
  };
}

function proxy(value: unknown): ServiceProxy {
  const data = object(value, "proxy");
  return {
    ip: string(data.ip, "proxy.ip"),
    password: string(data.password, "proxy.password"),
    port: integer(data.port, "proxy.port"),
    username: string(data.username, "proxy.username"),
  };
}

export function decodeProxies(value: unknown): ServiceProxy[] {
  return list(value, "proxies", proxy);
}

function residentialCountry(value: unknown): ResidentialCountry {
  const data = object(value, "residential country");
  return {
    id: integer(data.id, "country.id"),
    name: string(data.name, "country.name"),
    rotationIntervals: stringList(
      data.rotationIntervals,
      "country.rotationIntervals",
    ),
  };
}

export function decodeResidentialCountries(
  value: unknown,
): ResidentialCountry[] {
  return list(value, "residential countries", residentialCountry);
}

export function decodeRotationIntervals(
  value: unknown,
): ResidentialRotationIntervals {
  const data = object(value, "rotation intervals");
  return Object.fromEntries(
    Object.entries(data).map(([key, item]) => [
      key,
      string(item, `rotation interval.${key}`),
    ]),
  );
}

export function decodeResidentialProxyRequest(
  value: unknown,
): ResidentialProxyRequest {
  const data = object(value, "residential proxy request");
  return {
    countryId: integer(data.countryId, "proxy request.countryId"),
    createdAt: date(data.createdAt, "proxy request.createdAt"),
    id: string(data.id, "proxy request.id"),
    proxyCount: integer(data.proxyCount, "proxy request.proxyCount"),
    rotationInterval: string(
      data.rotationInterval,
      "proxy request.rotationInterval",
    ),
    status: string(data.status, "proxy request.status"),
    updatedAt: date(data.updatedAt, "proxy request.updatedAt"),
  };
}

export function decodeResidentialProxyRequests(
  value: unknown,
): ResidentialProxyRequest[] {
  return list(
    value,
    "residential proxy requests",
    decodeResidentialProxyRequest,
  );
}

export function decodeResidentialProxies(value: unknown): ResidentialProxy[] {
  return list(value, "residential proxies", proxy);
}

export function asInvalidResponse(
  error: unknown,
  status: number,
  body: string,
): InvalidResponseError {
  if (error instanceof InvalidResponseError) return error;
  return new InvalidResponseError(
    "API response did not match the expected shape.",
    status,
    body,
    { cause: error },
  );
}
