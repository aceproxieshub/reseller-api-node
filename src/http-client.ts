import { ApiError, InvalidResponseError, TransportError } from "./errors.js";
import { asInvalidResponse } from "./decoders.js";
import type { ApiEnvelope, Decoder } from "./types/api.js";
import type { ClientOptions } from "./types/client.js";
import { assertNonEmptyString, assertPositiveInteger } from "./validation.js";

const DEFAULT_BASE_URL = "https://reseller.aceproxies.com/";
const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 3;
const INITIAL_BACKOFF_MS = 100;
const MAX_BACKOFF_MS = 1_000;
const MAX_RETRY_AFTER_MS = 30_000;

interface RequestOptions {
  body?: BodyInit;
  headers?: HeadersInit;
  method: string;
}

export class HttpClient {
  readonly #baseUrl: string;
  readonly #fetch: typeof fetch;
  readonly #timeoutMs: number;
  readonly #token: string;

  public constructor(options: ClientOptions) {
    assertNonEmptyString(options.token, "API token");
    assertPositiveInteger(options.timeoutMs ?? DEFAULT_TIMEOUT_MS, "timeout");

    const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    let parsedBaseUrl: URL;
    try {
      parsedBaseUrl = new URL(baseUrl);
    } catch (error) {
      throw new TypeError("The base URL must be a valid URL.", {
        cause: error,
      });
    }
    if (
      !(["http:", "https:"] as const).includes(
        parsedBaseUrl.protocol as "http:" | "https:",
      )
    ) {
      throw new TypeError("The base URL must use HTTP or HTTPS.");
    }

    this.#baseUrl = `${parsedBaseUrl.toString().replace(/\/+$/, "")}/`;
    this.#fetch = options.fetch ?? globalThis.fetch;
    this.#timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.#token = options.token;

    if (!this.#fetch)
      throw new Error("A fetch implementation must be available.");
  }

  public get<T>(path: string, decoder: Decoder<T>): Promise<T> {
    return this.request(path, { method: "GET" }, decoder);
  }

  public postJson<T, TBody>(
    path: string,
    body: TBody,
    decoder: Decoder<T>,
  ): Promise<T> {
    return this.request(path, this.jsonOptions("POST", body), decoder);
  }

  public putJson<T, TBody>(
    path: string,
    body: TBody,
    decoder: Decoder<T>,
  ): Promise<T> {
    return this.request(path, this.jsonOptions("PUT", body), decoder);
  }

  public patchJsonWithoutData<TBody>(path: string, body: TBody): Promise<void> {
    return this.requestWithoutData(path, this.jsonOptions("PATCH", body));
  }

  public delete(path: string): Promise<void> {
    return this.requestWithoutData(path, { method: "DELETE" });
  }

  public deleteWithData<T>(path: string, decoder: Decoder<T>): Promise<T> {
    return this.request(path, { method: "DELETE" }, decoder);
  }

  private async request<T>(
    path: string,
    options: RequestOptions,
    decoder: Decoder<T>,
  ): Promise<T> {
    const response = await this.send(path, options);
    const body = await response.text();
    if (!response.ok) throw this.apiError(response.status, body);
    const payload = this.parseJson(body, response.status);
    this.throwForApiFailure(response, payload, body);

    if (!("data" in payload)) {
      throw new InvalidResponseError(
        "API response did not include data.",
        response.status,
        body,
      );
    }

    try {
      return decoder(payload.data);
    } catch (error) {
      throw asInvalidResponse(error, response.status, body);
    }
  }

  private async requestWithoutData(
    path: string,
    options: RequestOptions,
  ): Promise<void> {
    const response = await this.send(path, options);
    const body = await response.text();
    if (!response.ok) throw this.apiError(response.status, body);
    if (body === "") {
      return;
    }

    const payload = this.parseJson(body, response.status);
    this.throwForApiFailure(response, payload, body);
  }

  private async send(path: string, options: RequestOptions): Promise<Response> {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const response = await this.#fetch(
          new URL(path.replace(/^\/+/, ""), this.#baseUrl),
          {
            method: options.method,
            headers: this.buildHeaders(options.headers),
            signal: AbortSignal.timeout(this.#timeoutMs),
            ...(options.body === undefined ? {} : { body: options.body }),
          },
        );

        if (
          this.canRetry(options.method, attempt) &&
          (response.status === 429 || response.status >= 500)
        ) {
          await this.waitBeforeRetry(
            attempt,
            response.headers.get("retry-after"),
          );
          continue;
        }
        return response;
      } catch (error) {
        if (!this.canRetry(options.method, attempt)) {
          throw new TransportError("The HTTP request failed.", {
            cause: error,
          });
        }
        await this.waitBeforeRetry(attempt);
      }
    }
    throw new TransportError(
      "The HTTP request failed after all retry attempts.",
    );
  }

  private canRetry(method: string, attempt: number): boolean {
    return method === "GET" && attempt < MAX_ATTEMPTS;
  }

  private async waitBeforeRetry(
    attempt: number,
    retryAfter?: string | null,
  ): Promise<void> {
    const retryAfterMs = retryAfter ? this.parseRetryAfter(retryAfter) : null;
    const exponential = Math.min(
      INITIAL_BACKOFF_MS * 2 ** (attempt - 1),
      MAX_BACKOFF_MS,
    );
    const delay =
      retryAfterMs === null
        ? Math.floor(exponential / 2 + Math.random() * (exponential / 2))
        : Math.min(retryAfterMs, MAX_RETRY_AFTER_MS);
    await new Promise<void>((resolve) => setTimeout(resolve, delay));
  }

  private parseRetryAfter(value: string): number | null {
    if (/^\d+$/.test(value)) return Number(value) * 1_000;
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp)
      ? Math.max(0, timestamp - Date.now())
      : null;
  }

  private jsonOptions(method: string, body: unknown): RequestOptions {
    return {
      method,
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" },
    };
  }

  private buildHeaders(headers?: HeadersInit): Headers {
    const result = new Headers(headers);
    result.set("accept", "application/json");
    result.set("authorization", `Bearer ${this.#token}`);
    return result;
  }

  private parseJson(body: string, status: number): ApiEnvelope {
    try {
      const payload: unknown = JSON.parse(body);
      if (
        typeof payload !== "object" ||
        payload === null ||
        Array.isArray(payload)
      )
        throw new TypeError();
      return payload as ApiEnvelope;
    } catch (error) {
      throw new InvalidResponseError(
        "API response was not valid JSON.",
        status,
        body,
        { cause: error },
      );
    }
  }

  private throwForApiFailure(
    response: Response,
    payload: ApiEnvelope,
    body: string,
  ): void {
    if (!response.ok || this.hasError(payload.error)) {
      const error =
        typeof payload.error === "object" && payload.error !== null
          ? payload.error
          : undefined;
      throw new ApiError(
        error?.message ?? payload.message ?? "API request failed.",
        response.status,
        error?.code,
        body,
      );
    }
  }

  private apiError(status: number, body: string): ApiError {
    try {
      const payload = this.parseJson(body, status);
      const error =
        typeof payload.error === "object" && payload.error !== null
          ? payload.error
          : undefined;
      return new ApiError(
        error?.message ?? payload.message ?? "API request failed.",
        status,
        error?.code,
        body,
      );
    } catch {
      return new ApiError("API request failed.", status, undefined, body);
    }
  }

  private hasError(error: ApiEnvelope["error"]): boolean {
    if (error === undefined || error === null || error === false) return false;
    return typeof error !== "object" || Object.keys(error).length > 0;
  }
}
