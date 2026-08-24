export const ProductType = {
  DedicatedProxy: "dedicated_proxy",
  ResidentialProxy: "residential_proxy",
  PaygResidentialProxy: "payg_residential_proxy",
  StaticResidentialProxy: "static_residential_proxy",
  MobileProxy: "mobile_proxy",
} as const;

export type ProductType = (typeof ProductType)[keyof typeof ProductType];

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
