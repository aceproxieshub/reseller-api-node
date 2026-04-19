import { HttpClient } from "../http-client.js";
import type {
  Service,
  ServiceAuthCredentials,
  ServiceBandwidthResponse,
  ServiceListResponse,
  ServiceProlongation,
  ServiceProxy,
  ServiceWhitelistedIp,
  UpdateServiceAuthCredentialsRequest,
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

  public async getAuthCredentials(
    code: string,
  ): Promise<ServiceAuthCredentials> {
    return this.#httpClient.get<ServiceAuthCredentials>(
      `/api/v1/services/${code}/auth/credentials`,
    );
  }

  public async updateAuthCredentials(
    code: string,
    payload: UpdateServiceAuthCredentialsRequest,
  ): Promise<ServiceAuthCredentials> {
    return this.#httpClient.putJson<
      ServiceAuthCredentials,
      UpdateServiceAuthCredentialsRequest
    >(`/api/v1/services/${code}/auth/credentials`, payload);
  }

  public async getAuthWhitelistedIps(
    code: string,
  ): Promise<ServiceWhitelistedIp[]> {
    return this.#httpClient.get<ServiceWhitelistedIp[]>(
      `/api/v1/services/${code}/auth/whitelisted-ips`,
    );
  }

  public async deleteAuthWhitelistedIp(code: string, ip: string): Promise<void> {
    return this.#httpClient.delete(
      `/api/v1/services/${code}/auth/whitelisted-ips/${ip}`,
    );
  }

  public async getProxyList(code: string): Promise<ServiceProxy[]> {
    return this.#httpClient.get<ServiceProxy[]>(
      `/api/v1/services/${code}/proxy-list`,
    );
  }

  public async getProlongations(code: string): Promise<ServiceProlongation[]> {
    return this.#httpClient.get<ServiceProlongation[]>(
      `/api/v1/services/${code}/prolongations`,
    );
  }

  public async get(code: string): Promise<Service> {
    return this.#httpClient.get<Service>(`/api/v1/services/${code}`);
  }

  public async list(): Promise<ServiceListResponse> {
    return this.#httpClient.get<ServiceListResponse>("/api/v1/services");
  }
}
