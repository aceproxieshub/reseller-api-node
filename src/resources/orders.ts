import { HttpClient } from "../http-client.js";
import type { CreateOrderRequest, CreateOrderResponse } from "./orders.types.js";

export class OrdersResource {
  readonly #httpClient: HttpClient;

  public constructor(httpClient: HttpClient) {
    this.#httpClient = httpClient;
  }

  public async create(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
    return this.#httpClient.postJson<CreateOrderResponse, CreateOrderRequest>(
      "/api/v1/orders",
      payload,
    );
  }
}
