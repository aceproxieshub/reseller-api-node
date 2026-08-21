import { ApiError } from "../errors.js";
import {
  decodeCreateOrder,
  decodeOrder,
  decodeOrderList,
} from "../decoders.js";
import { HttpClient } from "../http-client.js";
import type { PaginationOptions } from "../types/client.js";
import {
  assertNonEmptyArray,
  assertNonEmptyString,
  assertPositiveInteger,
  encodePath,
} from "../validation.js";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderListResponse,
  OrderResponse,
} from "./orders.types.js";

export class OrdersResource {
  public constructor(private readonly httpClient: HttpClient) {}

  public list(options: PaginationOptions = {}): Promise<OrderListResponse> {
    return this.httpClient.get(this.listPath(options), decodeOrderList);
  }

  public async find(id: string): Promise<OrderResponse | null> {
    try {
      return await this.httpClient.get(
        `/api/v1/orders/${encodePath(id, "order ID")}`,
        decodeOrder,
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  }

  public create(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    assertNonEmptyArray(request.items, "order items");
    for (const item of request.items) {
      assertNonEmptyString(item.productId, "product ID");
      assertPositiveInteger(item.quantity, "order item quantity");
      if (item.durationId !== undefined)
        assertNonEmptyString(item.durationId, "duration ID");
    }
    return this.httpClient.postJson(
      "/api/v1/orders",
      request,
      decodeCreateOrder,
    );
  }

  private listPath(options: PaginationOptions): string {
    const query = new URLSearchParams();
    if (options.page !== undefined) {
      assertPositiveInteger(options.page, "page");
      query.set("page", String(options.page));
    }
    if (options.limit !== undefined) {
      assertPositiveInteger(options.limit, "limit");
      query.set("limit", String(options.limit));
    }
    const queryString = query.toString();
    return queryString === ""
      ? "/api/v1/orders"
      : `/api/v1/orders?${queryString}`;
  }
}
