import { decodeProducts, decodeProductTypes } from "../decoders.js";
import { HttpClient } from "../http-client.js";
import { ValidationError } from "../errors.js";
import {
  ProductType,
  type Product,
  type ProductTypesResponse,
} from "./products.types.js";

export class ProductsResource {
  public constructor(private readonly httpClient: HttpClient) {}

  public list(type?: ProductType): Promise<Product[]> {
    const query = new URLSearchParams();
    if (type !== undefined) {
      assertProductType(type, "product type");
      query.set("type", type);
    }
    const queryString = query.toString();
    const path =
      queryString === ""
        ? "/api/v1/products"
        : `/api/v1/products?${queryString}`;
    return this.httpClient.get(path, decodeProducts);
  }

  public types(): Promise<ProductTypesResponse> {
    return this.httpClient.get("/api/v1/products/types", decodeProductTypes);
  }
}

function assertProductType(
  value: string,
  name: string,
): asserts value is ProductType {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ValidationError(`The ${name} must not be empty.`);
  }
  if (!Object.values(ProductType).includes(value as ProductType)) {
    throw new ValidationError(`The ${name} is not supported.`);
  }
}
