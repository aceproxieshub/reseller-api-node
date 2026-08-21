import {
  decodeResidentialCountries,
  decodeResidentialProxies,
  decodeResidentialProxyRequest,
  decodeResidentialProxyRequests,
  decodeRotationIntervals,
} from "../decoders.js";
import { ApiError, ValidationError } from "../errors.js";
import { HttpClient } from "../http-client.js";
import { assertPositiveInteger, encodePath } from "../validation.js";
import {
  RotationInterval,
  type CreateResidentialProxyRequest,
  type ResidentialCountry,
  type ResidentialProxy,
  type ResidentialProxyRequest,
  type ResidentialRotationIntervals,
} from "./residential.types.js";

export class ResidentialResource {
  public constructor(private readonly httpClient: HttpClient) {}

  public countries(): Promise<ResidentialCountry[]> {
    return this.httpClient.get(
      "/api/v1/services/residential/countries",
      decodeResidentialCountries,
    );
  }

  public rotationIntervals(): Promise<ResidentialRotationIntervals> {
    return this.httpClient.get(
      "/api/v1/services/residential/rotation-intervals/",
      decodeRotationIntervals,
    );
  }

  public proxyRequests(code: string): Promise<ResidentialProxyRequest[]> {
    return this.httpClient.get(
      `${this.requestsPath(code)}`,
      decodeResidentialProxyRequests,
    );
  }

  public async findProxyRequest(
    code: string,
    id: string,
  ): Promise<ResidentialProxyRequest | null> {
    try {
      return await this.httpClient.get(
        `${this.requestsPath(code)}/${encodePath(id, "proxy request ID")}`,
        decodeResidentialProxyRequest,
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  }

  public createProxyRequest(
    code: string,
    request: CreateResidentialProxyRequest,
  ): Promise<ResidentialProxyRequest> {
    assertPositiveInteger(request.countryId, "country ID");
    assertPositiveInteger(request.proxyCount, "proxy count");
    if (!Object.values(RotationInterval).includes(request.rotationInterval)) {
      throw new ValidationError("The rotation interval is not supported.");
    }
    return this.httpClient.postJson(
      this.requestsPath(code),
      request,
      decodeResidentialProxyRequest,
    );
  }

  public deleteProxyRequest(
    code: string,
    id: string,
  ): Promise<ResidentialProxyRequest> {
    return this.httpClient.deleteWithData(
      `${this.requestsPath(code)}/${encodePath(id, "proxy request ID")}`,
      decodeResidentialProxyRequest,
    );
  }

  public getProxyList(code: string, id: string): Promise<ResidentialProxy[]> {
    return this.httpClient.get(
      `${this.requestsPath(code)}/${encodePath(id, "proxy request ID")}/proxy-list`,
      decodeResidentialProxies,
    );
  }

  private requestsPath(code: string): string {
    return `/api/v1/services/residential/${encodePath(code, "service code")}/proxy-requests`;
  }
}
