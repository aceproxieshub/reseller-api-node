export class ValidationError extends TypeError {
  public constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class ApiError extends Error {
  public constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly body?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class TransportError extends Error {
  public constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "TransportError";
  }
}

export class InvalidResponseError extends Error {
  public constructor(
    message: string,
    public readonly status: number,
    public readonly body: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "InvalidResponseError";
  }
}
