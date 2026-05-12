import OrderRestApi from "@libs/rest-api/order/order-rest-api";
import type { CreateOrderRequest } from "@libs/rest-api/order/request";
import { ROUTE_PATHS } from "@libs/route-config";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from '@tanstack/react-router';

const fetchAllOrders = () => {
  return useQuery({ queryKey: ['orders'], queryFn: OrderRestApi.fetchAll })
}

const fetchOrder = (id: string) => {
  return useQuery({ queryKey: ['order', id], queryFn: () => OrderRestApi.fetchOrder(id) })
}

const createOrder = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (request: CreateOrderRequest) => OrderRestApi.createOrder(request),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['order', response.order.id] })

      navigate({
        to: ROUTE_PATHS.orderDetail,
        search: {
          id: response.order.id
        }
      } as any)
    }
  })
}

const OrderService = { fetchAllOrders, fetchOrder, createOrder }

export default OrderService