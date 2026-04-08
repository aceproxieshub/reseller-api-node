import { HttpClient } from "../http-client.js";
import type { VersionResponse } from "./version.types.js";

export class VersionResource {
  readonly #httpClient: HttpClient;

  public constructor(httpClient: HttpClient) {
    this.#httpClient = httpClient;
  }

  public async get(): Promise<VersionResponse> {
    return this.#httpClient.get<VersionResponse>("/api/v1/version");
  }
}
