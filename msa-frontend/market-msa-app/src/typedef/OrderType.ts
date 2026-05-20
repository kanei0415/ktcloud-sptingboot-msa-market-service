export type OrderStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'SHIPPED'
  | 'CANCELLED'
  | string;

export type OrderLineItemStatus = OrderStatus;

export interface OrderLineItem {
  inventoryId: number;
  productId: string;
  skuCode: string;
  price: number;
  quantity: number;
  status: OrderLineItemStatus;
}

export interface Order {
  id: number;
  status: OrderStatus;
  orderLineItems: OrderLineItem[];
}
