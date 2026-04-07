import { HttpClient } from "../http-client.js";
import type { BalanceResponse } from "./balance.types.js";

export class BalanceResource {
  readonly #httpClient: HttpClient;

  public constructor(httpClient: HttpClient) {
    this.#httpClient = httpClient;
  }

  public async get(): Promise<BalanceResponse> {
    return this.#httpClient.get<BalanceResponse>("/api/v1/balance");
  }
}
