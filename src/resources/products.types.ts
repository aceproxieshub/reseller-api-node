export interface ProductDuration {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  durations: ProductDuration[];
  id: string;
  name: string;
  type: string;
}

export interface ProductTypesResponse {
  types: string[];
}
