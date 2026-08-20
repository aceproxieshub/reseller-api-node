export interface ClientOptions {
  baseUrl?: string;
  fetch?: typeof fetch;
  timeoutMs?: number;
  token: string;
}

export interface PaginationOptions {
  limit?: number;
  page?: number;
}
