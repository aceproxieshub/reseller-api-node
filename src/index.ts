import { ResellerApiClient } from "./client.js";
export { ApiError } from "./errors.js";
export type { ClientOptions } from "./types/client.js";
export type { BalanceResponse } from "./resources/balance.types.js";
export type { HealthResponse } from "./resources/health.types.js";
export type {
  CreateOrderItem,
  CreateOrderRequest,
  CreateOrderResponse,
  Money,
  Order,
  OrderDetails,
  OrderListResponse,
} from "./resources/orders.types.js";
export type {
  Product,
  ProductDuration,
  ProductTypesResponse,
} from "./resources/products.types.js";
export type {
  CreateServiceWhitelistedIpRequest,
  CreateServiceWhitelistedIpResponse,
  RequestServiceProlongation,
  Service,
  ServiceAmount,
  ServiceAuthCredentials,
  ServiceBandwidth,
  ServiceBandwidthResponse,
  ServiceListResponse,
  ServiceProlongation,
  ServiceProlongationRequestResponse,
  ServiceProxy,
  ServiceWhitelistedIp,
  UpdateServiceAuthCredentialsRequest,
} from "./resources/services.types.js";
export type { VersionResponse } from "./resources/version.types.js";

export { ResellerApiClient };

export function createClient(
  options: import("./types/client.js").ClientOptions,
): ResellerApiClient {
  return new ResellerApiClient(options);
}
