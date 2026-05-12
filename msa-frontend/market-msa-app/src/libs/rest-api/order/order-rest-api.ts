import api from "../rest-config"
import type { CreateOrderRequest } from "./request"
import type { CreateOrderResponse, FetchAllOrdersResponse, FetchOrderResponse } from "./response"

const ORDER_API_ENDPOINT = `/orders`

const ORDER_API_RESOURCES = {
  fetchAll: `${ORDER_API_ENDPOINT}`,
  findById: (id: string) => `${ORDER_API_ENDPOINT}/${id}`,
  createOrder: `${ORDER_API_ENDPOINT}`
}

async function fetchAll(): Promise<FetchAllOrdersResponse> {
  const response = await api.get<FetchAllOrdersResponse>(ORDER_API_RESOURCES.fetchAll)

  return response.data
}

async function fetchOrder(id: string): Promise<FetchOrderResponse> {
  const response = await api.get<FetchOrderResponse>(ORDER_API_RESOURCES.findById(id))

  return response.data
}

async function createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
  const response = await api.post<CreateOrderResponse>(ORDER_API_RESOURCES.createOrder, request)

  return response.data
}

const OrderRestApi = { fetchAll, fetchOrder, createOrder }

export default OrderRestApi