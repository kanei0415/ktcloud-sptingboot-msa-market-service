import InventoryService from "@services/rest-api/inventory-service"
import Inventory from "../Inventory"
import { useMemo } from "react"

const InventoryContainer = () => {
  const { data } = InventoryService.useFetchAllInventories()

  const inventories = useMemo(() => data ? data.inventories : [], [data])

  return <Inventory inventories={inventories} />
}

export default InventoryContainer