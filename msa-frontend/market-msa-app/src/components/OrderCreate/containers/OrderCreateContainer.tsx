import InventoryService from "@services/rest-api/inventory-service"
import OrderCreate from "../OrderCreate"
import { useCallback, useMemo, useState } from "react"
import OrderService from "@services/rest-api/order-service"
import type { Inventory } from "@typedef/InventoryType"

const OrderCreateContainer = () => {
  const { data: inventoryResponseData } = InventoryService.useFetchAllInventories()
  const { mutate } = OrderService.createOrder()

  const inventories = useMemo(
    () => inventoryResponseData ? inventoryResponseData.inventories : [],
    [inventoryResponseData]
  )

  const [selectedInventory, setSelectedInventory] = useState<Inventory[]>([])

  const onCreateButtonClicked = useCallback(() => {

  }, [selectedInventory])


  return <OrderCreate inventories={inventories} />
}

export default OrderCreateContainer