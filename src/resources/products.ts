import { decodeProducts, decodeProductTypes } from "../decoders.js";
import { HttpClient } from "../http-client.js";
import type { Product, ProductTypesResponse } from "./products.types.js";

export class ProductsResource {
  public constructor(private readonly httpClient: HttpClient) {}

  public list(): Promise<Product[]> {
    return this.httpClient.get("/api/v1/products", decodeProducts);
  }

  public types(): Promise<ProductTypesResponse> {
    return this.httpClient.get("/api/v1/products/types", decodeProductTypes);
  }
}
