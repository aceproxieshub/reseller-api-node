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
