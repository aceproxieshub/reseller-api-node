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

export interface ServiceProxy {
  ip: string;
  password: string;
  port: number;
  username: string;
}
