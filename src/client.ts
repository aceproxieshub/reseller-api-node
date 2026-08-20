import { decodeVersion } from "./decoders.js";
import { HttpClient } from "./http-client.js";
import { BalanceResource } from "./resources/balance.js";
import { HealthResource } from "./resources/health.js";
import { OrdersResource } from "./resources/orders.js";
import { ProductsResource } from "./resources/products.js";
import { ServicesResource } from "./resources/services.js";
import type { ClientOptions } from "./types/client.js";

export class ResellerApiClient {
  public readonly balance: BalanceResource;
  public readonly health: HealthResource;
  public readonly orders: OrdersResource;
  public readonly products: ProductsResource;
  public readonly services: ServicesResource;
  readonly #httpClient: HttpClient;

  public constructor(options: ClientOptions) {
    this.#httpClient = new HttpClient(options);
    this.balance = new BalanceResource(this.#httpClient);
    this.health = new HealthResource(this.#httpClient);
    this.orders = new OrdersResource(this.#httpClient);
    this.products = new ProductsResource(this.#httpClient);
    this.services = new ServicesResource(this.#httpClient);
  }

  public async getApiVersion(): Promise<string> {
    const response = await this.#httpClient.get(
      "/api/v1/version",
      decodeVersion,
    );
    return response.version;
  }
}
