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

  public constructor(options: ClientOptions) {
    const httpClient = new HttpClient(options);

    this.balance = new BalanceResource(httpClient);
    this.health = new HealthResource(httpClient);
    this.orders = new OrdersResource(httpClient);
    this.products = new ProductsResource(httpClient);
    this.services = new ServicesResource(httpClient);
  }
}
