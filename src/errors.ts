import type { ApiErrorPayload } from "./types/api.js";

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string | undefined;

  public constructor(message: string, status: number, error?: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = error?.code;
  }
}
