import { decodeBalance } from "../decoders.js";
import { HttpClient } from "../http-client.js";
import type { BalanceResponse } from "./balance.types.js";

export class BalanceResource {
  public constructor(private readonly httpClient: HttpClient) {}

  public getBalance(): Promise<BalanceResponse> {
    return this.httpClient.get("/api/v1/balance", decodeBalance);
  }
}
