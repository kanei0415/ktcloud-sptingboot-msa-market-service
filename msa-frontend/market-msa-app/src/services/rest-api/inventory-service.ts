import InventoryRestApi from '@libs/rest-api/inventory/inventory-rest-api';
import { useQuery } from '@tanstack/react-query';
import { inventoryKeys } from '@libs/query-keys';

export function useInventories() {
  return useQuery({
    queryKey: inventoryKeys.lists(),
    queryFn: InventoryRestApi.fetchAll,
  });
}

export function useInventory(id: string) {
  return useQuery({
    queryKey: inventoryKeys.detail(id),
    queryFn: () => InventoryRestApi.findById(id),
    enabled: Boolean(id),
  });
}
