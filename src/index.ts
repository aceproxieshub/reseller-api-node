import { ResellerApiClient } from "./client.js";
export { ApiError } from "./errors.js";
export type { ClientOptions, HealthResponse } from "./types.js";

export { ResellerApiClient };

export function createClient(
  options: import("./types.js").ClientOptions,
): ResellerApiClient {
  return new ResellerApiClient(options);
}
