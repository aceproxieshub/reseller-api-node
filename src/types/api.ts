export interface ApiErrorPayload {
  code?: string;
  message?: string;
}

export interface PatchApiResponse {
  error?: ApiErrorPayload | boolean;
  message?: string;
}

export interface ApiResponse<TData> {
  data?: TData;
  error?: ApiErrorPayload | boolean;
  message?: string;
}
