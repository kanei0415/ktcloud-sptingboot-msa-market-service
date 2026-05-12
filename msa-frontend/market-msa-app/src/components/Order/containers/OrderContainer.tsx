import OrderService from "@services/rest-api/order-service"
import Order from "../Order"
import { useMemo } from "react"

const OrderContainer = () => {
  const { data } = OrderService.fetchAllOrders()

  const orders = useMemo(() => data ? data.orders : [], [data])

  return <Order orders={orders} />
}

export default OrderContainer