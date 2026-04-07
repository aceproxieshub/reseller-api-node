import { ApiError } from "./errors.js";
import type { ApiErrorPayload, ApiResponse, ClientOptions } from "./types.js";

interface RequestOptions {
  method?: string;
  body?: BodyInit;
  headers?: HeadersInit;
}

export class HttpClient {
  readonly #baseUrl: string;
  readonly #token: string | undefined;
  readonly #fetch: typeof fetch;

  public constructor(options: ClientOptions) {
    this.#baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.#token = options.token;
    this.#fetch = options.fetch ?? globalThis.fetch;

    if (!this.#fetch) {
      throw new Error("A fetch implementation must be available.");
    }
  }

  public async get<TData>(
    path: string,
    options: RequestOptions = {},
  ): Promise<TData> {
    return this.request<TData>(path, { ...options, method: "GET" });
  }

  public async request<TData>(
    path: string,
    options: RequestOptions = {},
  ): Promise<TData> {
    const requestInit: RequestInit = {
      method: options.method ?? "GET",
      headers: this.buildHeaders(options.headers),
      ...(options.body ? { body: options.body } : {}),
    };

    const response = await this.#fetch(
      new URL(path, `${this.#baseUrl}/`),
      requestInit,
    );

    const payload = await this.parseResponse<TData>(response);

    if (!response.ok) {
      throw this.toApiError(response.status, payload.error);
    }

    if (payload.error) {
      throw this.toApiError(response.status, payload.error);
    }

    if (typeof payload.data === "undefined") {
      throw new ApiError("API response did not include data.", response.status);
    }

    return payload.data;
  }

  private buildHeaders(headers?: HeadersInit): Headers {
    const result = new Headers(headers);
    result.set("accept", "application/json");

    if (this.#token) {
      result.set("authorization", `Bearer ${this.#token}`);
    }

    return result;
  }

  private async parseResponse<TData>(
    response: Response,
  ): Promise<ApiResponse<TData>> {
    const text = await response.text();

    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text) as ApiResponse<TData>;
    } catch {
      throw new ApiError("API response was not valid JSON.", response.status);
    }
  }

  private toApiError(status: number, error?: ApiErrorPayload): ApiError {
    return new ApiError(error?.message ?? "API request failed.", status, error);
  }
}
