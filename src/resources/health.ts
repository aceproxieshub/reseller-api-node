import { decodeHealth } from "../decoders.js";
import { HttpClient } from "../http-client.js";
import type { HealthResponse } from "./health.types.js";

export class HealthResource {
  public constructor(private readonly httpClient: HttpClient) {}

  public getHealth(): Promise<HealthResponse> {
    return this.httpClient.get("/api/v1/health", decodeHealth);
  }
}
