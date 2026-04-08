export interface CreateOrderItem {
  addons?: unknown[];
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

export interface Order {
  createdAt: string;
  description: string;
  id: string;
  status: string;
  total: Money;
}

export interface OrderListResponse {
  items: Order[];
  limit: number;
  page: number;
}

export interface OrderDetails extends Order {
  isRecurring: boolean;
}
