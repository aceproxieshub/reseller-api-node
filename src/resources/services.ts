import {
  decodeBandwidth,
  decodeCreateProlongation,
  decodeCredentials,
  decodeIpReplacement,
  decodeIpReplacementCount,
  decodeIpReplacementLocations,
  decodeIpReplacements,
  decodeProlongations,
  decodeProxies,
  decodeServiceDetail,
  decodeServiceList,
  decodeWhitelistedIp,
  decodeWhitelistedIps,
} from "../decoders.js";
import { ApiError, ValidationError } from "../errors.js";
import { HttpClient } from "../http-client.js";
import type { PaginationOptions } from "../types/client.js";
import {
  assertIpAddress,
  assertNonEmptyString,
  assertPositiveInteger,
  encodePath,
} from "../validation.js";
import { ResidentialResource } from "./residential.js";
import {
  Protocol,
  type CreateIpReplacementRequest,
  type CreateProlongationRequest,
  type CreateProlongationResponse,
  type CreateWhitelistedIpRequest,
  type ServiceBandwidthResponse,
  type ServiceCredentials,
  type ServiceDetail,
  type ServiceIpReplacement,
  type ServiceIpReplacementCount,
  type ServiceIpReplacementLocations,
  type ServiceListResponse,
  type ServiceProlongation,
  type ServiceProxy,
  type ServiceWhitelistedIp,
  type UpdateCredentialsRequest,
  type UpdateServiceRequest,
} from "./services.types.js";

export class ServicesResource {
  public readonly residential: ResidentialResource;

  public constructor(private readonly httpClient: HttpClient) {
    this.residential = new ResidentialResource(httpClient);
  }

  public list(options: PaginationOptions = {}): Promise<ServiceListResponse> {
    const query = new URLSearchParams();
    if (options.page !== undefined) {
      assertPositiveInteger(options.page, "page");
      query.set("page", String(options.page));
    }
    if (options.limit !== undefined) {
      assertPositiveInteger(options.limit, "limit");
      query.set("limit", String(options.limit));
    }
    const queryString = query.toString();
    const path =
      queryString === ""
        ? "/api/v1/services"
        : `/api/v1/services?${queryString}`;
    return this.httpClient.get(path, decodeServiceList);
  }

  public async find(code: string): Promise<ServiceDetail | null> {
    return this.nullableGet(
      `/api/v1/services/${encodePath(code, "service code")}`,
      decodeServiceDetail,
    );
  }

  public async getBandwidth(
    code: string,
  ): Promise<ServiceBandwidthResponse | null> {
    return this.nullableGet(
      `/api/v1/services/${encodePath(code, "service code")}/bandwidth`,
      decodeBandwidth,
    );
  }

  public async getCredentials(
    code: string,
  ): Promise<ServiceCredentials | null> {
    return this.nullableGet(
      `/api/v1/services/${encodePath(code, "service code")}/auth/credentials`,
      decodeCredentials,
    );
  }

  public updateCredentials(
    code: string,
    request: UpdateCredentialsRequest,
  ): Promise<ServiceCredentials> {
    assertNonEmptyString(request.password, "password");
    return this.httpClient.putJson(
      `/api/v1/services/${encodePath(code, "service code")}/auth/credentials`,
      request,
      decodeCredentials,
    );
  }

  public getWhitelistedIps(code: string): Promise<ServiceWhitelistedIp[]> {
    return this.httpClient.get(
      `/api/v1/services/${encodePath(code, "service code")}/auth/whitelisted-ips`,
      decodeWhitelistedIps,
    );
  }

  public addWhitelistedIp(
    code: string,
    request: CreateWhitelistedIpRequest,
  ): Promise<ServiceWhitelistedIp> {
    assertIpAddress(request.ip, "IP address");
    return this.httpClient.postJson(
      `/api/v1/services/${encodePath(code, "service code")}/auth/whitelisted-ips`,
      request,
      decodeWhitelistedIp,
    );
  }

  public deleteWhitelistedIp(code: string, ip: string): Promise<void> {
    assertIpAddress(ip, "IP address");
    return this.httpClient.delete(
      `/api/v1/services/${encodePath(code, "service code")}/auth/whitelisted-ips/${encodeURIComponent(ip)}`,
    );
  }

  public getIpReplacements(code: string): Promise<ServiceIpReplacement[]> {
    return this.httpClient.get(
      `/api/v1/services/${encodePath(code, "service code")}/ip-replacements`,
      decodeIpReplacements,
    );
  }

  public createIpReplacement(
    code: string,
    request: CreateIpReplacementRequest = {},
  ): Promise<ServiceIpReplacement> {
    return this.httpClient.postJson(
      `/api/v1/services/${encodePath(code, "service code")}/ip-replacements`,
      request,
      decodeIpReplacement,
    );
  }

  public getAvailableIpReplacements(
    code: string,
  ): Promise<ServiceIpReplacementCount> {
    return this.httpClient.get(
      `/api/v1/services/${encodePath(code, "service code")}/ip-replacements/available`,
      decodeIpReplacementCount,
    );
  }

  public getIpReplacementCount(
    code: string,
  ): Promise<ServiceIpReplacementCount> {
    return this.httpClient.get(
      `/api/v1/services/${encodePath(code, "service code")}/ip-replacements/count`,
      decodeIpReplacementCount,
    );
  }

  public getIpReplacementLocations(
    code: string,
  ): Promise<ServiceIpReplacementLocations> {
    return this.httpClient.get(
      `/api/v1/services/${encodePath(code, "service code")}/ip-replacements/locations`,
      decodeIpReplacementLocations,
    );
  }

  public getProlongations(code: string): Promise<ServiceProlongation[]> {
    return this.httpClient.get(
      `/api/v1/services/${encodePath(code, "service code")}/prolongations`,
      decodeProlongations,
    );
  }

  public createProlongation(
    code: string,
    request: CreateProlongationRequest,
  ): Promise<CreateProlongationResponse> {
    assertNonEmptyString(request.durationId, "duration ID");
    assertPositiveInteger(request.quantity, "quantity");
    return this.httpClient.postJson(
      `/api/v1/services/${encodePath(code, "service code")}/prolongations`,
      request,
      decodeCreateProlongation,
    );
  }

  public getProxyList(code: string): Promise<ServiceProxy[]> {
    return this.httpClient.get(
      `/api/v1/services/${encodePath(code, "service code")}/proxy-list`,
      decodeProxies,
    );
  }

  public update(code: string, request: UpdateServiceRequest): Promise<void> {
    if (request.auth === undefined && request.protocol === undefined) {
      throw new ValidationError(
        "The service update must contain at least one field.",
      );
    }
    if (request.auth !== undefined)
      assertNonEmptyString(request.auth.method, "service auth method");
    if (
      request.protocol !== undefined &&
      !Object.values(Protocol).includes(request.protocol)
    ) {
      throw new ValidationError("The protocol must be http or socks5.");
    }
    return this.httpClient.patchJsonWithoutData(
      `/api/v1/services/${encodePath(code, "service code")}`,
      request,
    );
  }

  private async nullableGet<T>(
    path: string,
    decoder: (value: unknown) => T,
  ): Promise<T | null> {
    try {
      return await this.httpClient.get(path, decoder);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  }
}
