import { HttpClient } from "../http-client.js";
import type {
  Service,
  ServiceBandwidthResponse,
  ServiceListResponse,
  ServiceProxy,
} from "./services.types.js";

export class ServicesResource {
  readonly #httpClient: HttpClient;

  public constructor(httpClient: HttpClient) {
    this.#httpClient = httpClient;
  }

  public async getBandwidth(code: string): Promise<ServiceBandwidthResponse> {
    return this.#httpClient.get<ServiceBandwidthResponse>(
      `/api/v1/services/${code}/bandwidth`,
    );
  }

  public async getProxyList(code: string): Promise<ServiceProxy[]> {
    return this.#httpClient.get<ServiceProxy[]>(
      `/api/v1/services/${code}/proxy-list`,
    );
  }

  public async get(code: string): Promise<Service> {
    return this.#httpClient.get<Service>(`/api/v1/services/${code}`);
  }

  public async list(): Promise<ServiceListResponse> {
    return this.#httpClient.get<ServiceListResponse>("/api/v1/services");
  }
}
