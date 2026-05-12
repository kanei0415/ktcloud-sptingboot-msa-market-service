import type { Inventory } from "@typedef/InventoryType";

export interface FetchAllInventoriesResponse {
  inventories: Inventory[]
}

export interface FindByIdInventoryResponse {
  inventory: Inventory
}