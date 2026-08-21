import { ResellerApiClient } from "./client.js";

export { ResellerApiClient };
export {
  ApiError,
  InvalidResponseError,
  TransportError,
  ValidationError,
} from "./errors.js";
export { RotationInterval } from "./resources/residential.types.js";
export { Protocol } from "./resources/services.types.js";
export type { ClientOptions, PaginationOptions } from "./types/client.js";
export type { BalanceResponse } from "./resources/balance.types.js";
export type { HealthResponse } from "./resources/health.types.js";
export type {
  CreateOrderItem,
  CreateOrderRequest,
  CreateOrderResponse,
  Money,
  OrderListResponse,
  OrderResponse,
} from "./resources/orders.types.js";
export type {
  Product,
  ProductDuration,
  ProductTypesResponse,
} from "./resources/products.types.js";
export type {
  CreateResidentialProxyRequest,
  ResidentialCountry,
  ResidentialProxy,
  ResidentialProxyRequest,
  ResidentialRotationIntervals,
} from "./resources/residential.types.js";
export type {
  CreateIpReplacementRequest,
  CreateProlongationRequest,
  CreateProlongationResponse,
  CreateWhitelistedIpRequest,
  ServiceAmount,
  ServiceAuth,
  ServiceBandwidth,
  ServiceBandwidthResponse,
  ServiceCredentials,
  ServiceDetail,
  ServiceIpReplacement,
  ServiceIpReplacementCount,
  ServiceIpReplacementLocation,
  ServiceIpReplacementLocations,
  ServiceListResponse,
  ServicePrice,
  ServiceProlongation,
  ServiceProxy,
  ServiceSummary,
  ServiceWhitelistedIp,
  UpdateCredentialsRequest,
  UpdateServiceAuthPayload,
  UpdateServiceRequest,
} from "./resources/services.types.js";

export function createClient(
  options: import("./types/client.js").ClientOptions,
): ResellerApiClient {
  return new ResellerApiClient(options);
}
