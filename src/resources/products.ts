import { HttpClient } from "../http-client.js";
import type { ProductTypesResponse } from "./products.types.js";

export class ProductsResource {
  readonly #httpClient: HttpClient;

  public constructor(httpClient: HttpClient) {
    this.#httpClient = httpClient;
  }

  public async getTypes(): Promise<ProductTypesResponse> {
    return this.#httpClient.get<ProductTypesResponse>("/api/v1/products/types");
  }
}
