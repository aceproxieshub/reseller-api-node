export interface ApiErrorPayload {
  code?: string;
  message?: string;
}

export interface ApiResponse<TData> {
  data?: TData;
  error?: ApiErrorPayload;
}
