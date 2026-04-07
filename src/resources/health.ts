import { HttpClient } from "../http-client.js";
import type { HealthResponse } from "./health.types.js";

export class HealthResource {
  readonly #httpClient: HttpClient;

  public constructor(httpClient: HttpClient) {
    this.#httpClient = httpClient;
  }

  public async check(): Promise<HealthResponse> {
    return this.#httpClient.get<HealthResponse>("/api/v1/health");
  }
}
