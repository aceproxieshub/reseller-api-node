export const RotationInterval = {
  All: "all",
  High: "high",
  OneMinute: "1min",
  TenMinutes: "10min",
  ThirtyMinutes: "30min",
} as const;

export type RotationInterval =
  (typeof RotationInterval)[keyof typeof RotationInterval];

export interface ResidentialCountry {
  id: number;
  name: string;
  rotationIntervals: string[];
}

export type ResidentialRotationIntervals = Record<string, string>;

export interface ResidentialProxyRequest {
  countryId: number;
  createdAt: string;
  id: string;
  proxyCount: number;
  rotationInterval: string;
  status: string;
  updatedAt: string;
}

export interface CreateResidentialProxyRequest {
  countryId: number;
  proxyCount: number;
  rotationInterval: RotationInterval;
}

export interface ResidentialProxy {
  ip: string;
  password: string;
  port: number;
  username: string;
}
