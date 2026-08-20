export interface ApiErrorPayload {
  code?: string;
  message?: string;
}

export interface ApiEnvelope {
  data?: unknown;
  error?: ApiErrorPayload | boolean | null;
  message?: string;
}

export type Decoder<T> = (value: unknown) => T;
