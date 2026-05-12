
export interface OrderListItem {
  "inventoryId": number,
  "productId": string,
  "skuCode": string,
  "price": number,
  "quantity": number,
  "status": string
}

export interface Order {
  "id": number,
  "status": string,
  "orderLineItems": OrderListItem[]
}