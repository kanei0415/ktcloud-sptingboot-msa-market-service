import ProductRestApi from '@libs/rest-api/product/product-rest-api';
import { useQuery } from '@tanstack/react-query';
import { productKeys } from '@libs/query-keys';

export function useProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: ProductRestApi.fetchAll,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => ProductRestApi.findById(id),
    enabled: Boolean(id),
  });
}
