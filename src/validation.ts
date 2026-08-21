import { isIP } from "node:net";
import { ValidationError } from "./errors.js";

export function assertNonEmptyString(value: string, name: string): void {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ValidationError(`The ${name} must not be empty.`);
  }
}

export function assertPositiveInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value < 1) {
    throw new ValidationError(`The ${name} must be a positive integer.`);
  }
}

export function assertIpAddress(value: string, name: string): void {
  if (isIP(value) === 0) {
    throw new ValidationError(`The ${name} must be a valid IP address.`);
  }
}

export function assertNonEmptyArray(
  value: readonly unknown[],
  name: string,
): void {
  if (value.length === 0) {
    throw new ValidationError(`The ${name} must contain at least one item.`);
  }
}

export function encodePath(value: string, name: string): string {
  assertNonEmptyString(value, name);
  return encodeURIComponent(value);
}
