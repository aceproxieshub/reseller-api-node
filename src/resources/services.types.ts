export interface ServiceAmount {
  amount: number;
  unit: string;
}

export interface Service {
  amount: ServiceAmount;
  code: string;
  createdAt: string;
  expiredAt: string;
  orderId: string;
  startedAt: string;
  status: string;
}

export interface ServiceListResponse {
  items: Service[];
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

export interface ServiceAuthCredentials {
  password: string;
  username: string;
}

export interface UpdateServiceAuthCredentialsRequest {
  password: string;
  username: string;
}

export interface ServiceWhitelistedIp {
  description: string;
  ip: string;
}

export interface CreateServiceWhitelistedIpRequest {
  ip: string;
}

export interface CreateServiceWhitelistedIpResponse {
  ip: string;
}

export interface RequestServiceProlongation {
  durationId: string;
  quantity: number;
}

export interface ServiceProlongationRequestResponse {
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
