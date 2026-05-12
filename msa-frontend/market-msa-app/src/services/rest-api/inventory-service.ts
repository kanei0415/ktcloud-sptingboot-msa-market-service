import InventoryRestApi from "@libs/rest-api/inventory/inventory-rest-api"
import { useQuery } from "@tanstack/react-query"

const useFetchAllInventories = () => {
  return useQuery({ queryKey: ['inventories'], queryFn: InventoryRestApi.fetchAll })
}

const useFindByIdInventory = (id: string) => {
  return useQuery({ queryKey: ['inventory', id], queryFn: () => InventoryRestApi.findById(id) })
}

const InventoryService = { useFetchAllInventories, useFindByIdInventory }

export default InventoryService