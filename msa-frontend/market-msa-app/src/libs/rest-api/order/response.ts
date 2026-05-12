import type { Order } from "@typedef/OrderType";

export interface FetchAllOrdersResponse {
  orders: Order[]
}

export interface FetchOrderResponse {
  order: Order
}

export interface CreateOrderResponse {
  order: Order
}