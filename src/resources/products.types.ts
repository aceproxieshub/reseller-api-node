export interface ProductDuration {
  durationDays: number;
  id: string;
  name: string;
  price: number;
}

export interface Product {
  addons: unknown;
  durations: ProductDuration[] | null;
  id: string;
  name: string;
  options: Record<string, unknown>;
  price: number | null;
  type: string;
}

export interface ProductTypesResponse {
  types: string[];
}
