import InventoryService from "@services/rest-api/inventory-service"
import OrderCreate from "../OrderCreate"
import { useCallback, useMemo, useState } from "react"
import OrderService from "@services/rest-api/order-service"
import type { Inventory } from "@typedef/InventoryType"
import ProductService from "@services/rest-api/product-service"
import type { Product } from "@typedef/ProductType"

const OrderCreateContainer = () => {
  const { data: inventoryResponseData } = InventoryService.useFetchAllInventories()
  const { data: productResponseData } = ProductService.useFetchAllProducts()
  const { mutate } = OrderService.createOrder()

  const inventories = useMemo(
    () => inventoryResponseData ? inventoryResponseData.inventories : [],
    [inventoryResponseData]
  )

  const products = useMemo(
    () => productResponseData ? productResponseData.products : [],
    [productResponseData]
  )

  const productInventoriesInfo = useMemo<[Product, Inventory[]][]>(
    () => products.map(product => [
      product, inventories.filter((inventory) => inventory.productId === product.id)
    ]),
    [products, inventories]
  )

  const [selectedOrderItem, setSelectedOrderItem] = useState<[Product, Inventory[], number][]>([])

  const orderListRequest = useMemo<{
    inventoryId: number;
    productId: string;
    skuCode: string;
    price: number;
    quantity: number;
  }[]>(() => [], [selectedOrderItem])

  const onCreateButtonClicked = useCallback(() => {
    mutate({
      items: 
    })
  }, [selectedOrderItem])


  return <OrderCreate inventories={inventories} />
}

export default OrderCreateContainer