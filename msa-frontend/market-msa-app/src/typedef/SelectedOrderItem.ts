import type { Inventory } from '@typedef/InventoryType';
import type { Product } from '@typedef/ProductType';

export interface SelectedOrderItem {
  product: Product;
  inventory: Inventory;
  quantity: number;
}
