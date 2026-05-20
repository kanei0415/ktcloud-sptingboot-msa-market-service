export interface CreateOrderRequest {
  items: {
    inventoryId: number;
    productId: string;
    skuCode: string;
    price: number;
    quantity: number;
  }[];
}
