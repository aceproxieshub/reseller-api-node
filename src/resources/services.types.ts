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
