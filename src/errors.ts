import type { ApiErrorPayload, PatchApiResponse } from "./types/api.js";

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string | undefined;

  public constructor(
    message: string,
    status: number,
    error?: ApiErrorPayload | PatchApiResponse,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code =
      error && typeof error === "object" && "code" in error
        ? error.code as string | undefined
        : undefined;
  }
}
