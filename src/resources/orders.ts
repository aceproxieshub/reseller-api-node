import { HttpClient } from "../http-client.js";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderListResponse,
} from "./orders.types.js";

export class OrdersResource {
  readonly #httpClient: HttpClient;

  public constructor(httpClient: HttpClient) {
    this.#httpClient = httpClient;
  }

  public async list(): Promise<OrderListResponse> {
    return this.#httpClient.get<OrderListResponse>("/api/v1/orders");
  }

  public async create(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
    return this.#httpClient.postJson<CreateOrderResponse, CreateOrderRequest>(
      "/api/v1/orders",
      payload,
    );
  }
}
