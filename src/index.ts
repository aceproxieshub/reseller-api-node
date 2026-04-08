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
  OrderListResponse,
} from "./resources/orders.types.js";
export type {
  Product,
  ProductDuration,
  ProductTypesResponse,
} from "./resources/products.types.js";

export { ResellerApiClient };

export function createClient(
  options: import("./types/client.js").ClientOptions,
): ResellerApiClient {
  return new ResellerApiClient(options);
}
