import type { Product } from "@typedef/ProductType";

export interface FetchAllProductsResponse {
  products: Product[]
}

export interface FindByIdProductResponse {
  product: Product
}