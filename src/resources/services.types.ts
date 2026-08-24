export const Protocol = {
  Http: "http",
  Socks5: "socks5",
} as const;

export type Protocol = (typeof Protocol)[keyof typeof Protocol];

export interface ServiceAmount {
  amount: number;
  unit: string;
}

export interface ServiceAuth {
  method: string;
}

export interface ServicePrice {
  amount: number;
  currency: string;
}

export interface ServiceSummary {
  amount: ServiceAmount | null;
  auth: ServiceAuth | null;
  code: string;
  createdAt: string | null;
  expiredAt: string | null;
  orderId: string;
  startedAt: string | null;
  status: string;
  type: string | null;
}

export interface ServiceDetail {
  amount: ServiceAmount;
  auth: ServiceAuth;
  code: string;
  createdAt: string;
  expiresAt: string | null;
  isRecurring: boolean;
  orderId: number;
  orderUuid: string;
  price: ServicePrice;
  protocol: string;
  /** @deprecated Use `type` instead. */
  serviceType: string;
  type: string;
  startedAt: string | null;
  status: string;
  userId: string;
}

export interface ServiceListResponse {
  items: ServiceSummary[];
  limit: number;
  page: number;
}

export interface ServiceBandwidth {
  available: number;
  total: number;
  unit: string;
  used: number;
}

export interface ServiceBandwidthResponse {
  bandwidth: ServiceBandwidth;
}

export interface ServiceCredentials {
  password: string;
  username: string;
}

export interface UpdateCredentialsRequest {
  password: string;
  username?: string;
}

export interface UpdateServiceAuthPayload {
  method: string;
}

export interface UpdateServiceRequest {
  auth?: UpdateServiceAuthPayload;
  protocol?: Protocol;
}

export interface ServiceWhitelistedIp {
  description: string | null;
  ip: string;
}

export interface CreateWhitelistedIpRequest {
  ip: string;
}

export interface CreateIpReplacementRequest {
  locations?: string[];
}

export interface ServiceIpReplacement {
  createdAt: string;
  replacedAt: string | null;
  status: string;
  uuid: string;
}

export interface ServiceIpReplacementCount {
  count: number;
}

export interface ServiceIpReplacementLocation {
  country: string;
  id: string;
  location: string;
}

export interface ServiceIpReplacementLocations {
  locations: ServiceIpReplacementLocation[];
}

export interface CreateProlongationRequest {
  durationId: string;
  quantity: number;
}

export interface CreateProlongationResponse {
  durationId: string;
  newExpirationDate: string;
  quantity: number;
  status: string;
}

export interface ServiceProlongation {
  durationDays: number;
  durationId: string;
  name: string;
  price: number;
}

export interface ServiceProxy {
  ip: string;
  password: string;
  port: number;
  username: string;
}
