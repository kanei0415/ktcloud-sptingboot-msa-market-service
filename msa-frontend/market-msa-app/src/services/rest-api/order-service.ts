import OrderRestApi from '@libs/rest-api/order/order-rest-api';
import type { CreateOrderRequest } from '@libs/rest-api/order/request';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderKeys, inventoryKeys } from '@libs/query-keys';

export function useOrders() {
  return useQuery({
    queryKey: orderKeys.lists(),
    queryFn: OrderRestApi.fetchAll,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => OrderRestApi.fetchOrder(id),
    enabled: Boolean(id),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateOrderRequest) => OrderRestApi.createOrder(request),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      queryClient.setQueryData(orderKeys.detail(response.order.id), response);
    },
  });
}
