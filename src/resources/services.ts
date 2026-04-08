import { HttpClient } from "../http-client.js";
import type { Service, ServiceListResponse } from "./services.types.js";

export class ServicesResource {
  readonly #httpClient: HttpClient;

  public constructor(httpClient: HttpClient) {
    this.#httpClient = httpClient;
  }

  public async get(code: string): Promise<Service> {
    return this.#httpClient.get<Service>(`/api/v1/services/${code}`);
  }

  public async list(): Promise<ServiceListResponse> {
    return this.#httpClient.get<ServiceListResponse>("/api/v1/services");
  }
}
