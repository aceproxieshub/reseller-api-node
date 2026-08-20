export interface CreateOrderItem {
  addons?: Record<string, unknown>;
  durationId?: string;
  options?: Record<string, unknown>;
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  items: CreateOrderItem[];
}

export interface CreateOrderResponse {
  createdAt: string;
  id: string;
  status: string;
}

export interface Money {
  amount: number;
  currency: string;
}

export interface OrderResponse {
  createdAt: string;
  description: string;
  id: string;
  isRecurring: boolean;
  status: string;
  total: Money;
}

export interface OrderListResponse {
  items: OrderResponse[];
  limit: number;
  page: number;
}
