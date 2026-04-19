import { ApiError } from "./errors.js";
import type { ApiErrorPayload, ApiResponse, PatchApiResponse} from "./types/api.js";
import type { ClientOptions } from "./types/client.js";

const DEFAULT_BASE_URL = "https://reseller.aceproxies.com/";

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
    this.#baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
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

  public async post<TData>(
    path: string,
    options: RequestOptions = {},
  ): Promise<TData> {
    return this.request<TData>(path, { ...options, method: "POST" });
  }

  public async postJson<TData, TBody>(path: string, body: TBody): Promise<TData> {
    return this.post<TData>(path, {
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
      },
    });
  }

  public async put<TData>(
    path: string,
    options: RequestOptions = {},
  ): Promise<TData> {
    return this.request<TData>(path, { ...options, method: "PUT" });
  }

  public async putJson<TData, TBody>(path: string, body: TBody): Promise<TData> {
    return this.put<TData>(path, {
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
      },
    });
  }

  public async delete(
    path: string,
    options: RequestOptions = {},
  ): Promise<void> {
    return this.requestWithoutData(path, { ...options, method: "DELETE" });
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
      throw this.toApiError(response.status, payload);
    }

    if (
      typeof payload.error !== "undefined" &&
      payload.error !== null &&
      payload.error !== false
    ) {
      throw this.toApiError(response.status, payload);
    }

    if (typeof payload.data === "undefined") {
      throw new ApiError("API response did not include data.", response.status);
    }

    return payload.data;
  }

  public async requestWithoutData(
    path: string,
    options: RequestOptions = {},
  ): Promise<void> {
    const requestInit: RequestInit = {
      method: options.method ?? "GET",
      headers: this.buildHeaders(options.headers),
      ...(options.body ? { body: options.body } : {}),
    };

    const response = await this.#fetch(
      new URL(path, `${this.#baseUrl}/`),
      requestInit,
    );

    const payload = await this.parseResponse(response);

    if (!response.ok) {
      throw this.toApiError(response.status, payload);
    }

    if (typeof payload.error !== "undefined" && payload.error !== false) {
      throw this.toApiError(response.status, payload);
    }
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

  private toApiError(
    status: number,
    payload?: ApiErrorPayload | PatchApiResponse | ApiResponse<unknown> | boolean,
  ): ApiError {
    if (payload && typeof payload === "object" && "error" in payload) {
      const errorPayload =
        payload.error && typeof payload.error === "object" ? payload.error : undefined;

      return new ApiError(
        errorPayload?.message ?? payload.message ?? "API request failed.",
        status,
        errorPayload ?? payload,
      );
    }

    const errorPayload = payload && typeof payload === "object" ? payload : undefined;
    return new ApiError(
      errorPayload?.message ?? "API request failed.",
      status,
      errorPayload,
    );
  }
}
