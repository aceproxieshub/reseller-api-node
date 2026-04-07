import { HttpClient } from "./http-client.js";
import { HealthResource } from "./resources/health.js";
import type { ClientOptions } from "./types.js";

export class ResellerApiClient {
  public readonly health: HealthResource;

  public constructor(options: ClientOptions) {
    const httpClient = new HttpClient(options);

    this.health = new HealthResource(httpClient);
  }
}
