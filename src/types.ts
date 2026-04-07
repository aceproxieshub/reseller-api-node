export interface ApiErrorPayload {
  code?: string;
  message?: string;
}

export interface ApiResponse<TData> {
  data?: TData;
  error?: ApiErrorPayload;
}

export interface HealthResponse {
  status: string;
}

export interface ClientOptions {
  baseUrl: string;
  token?: string;
  fetch?: typeof fetch;
}
