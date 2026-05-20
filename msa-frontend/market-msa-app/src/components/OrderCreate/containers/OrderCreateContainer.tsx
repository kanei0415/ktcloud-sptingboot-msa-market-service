import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInventories } from '@services/rest-api/inventory-service';
import { useProducts } from '@services/rest-api/product-service';
import { useCreateOrder } from '@services/rest-api/order-service';
import { ROUTE_PATHS } from '@libs/route-config';
import { useSnackbar } from '@components/common/Snackbar/snackbar-context';
import OrderCreate from '../OrderCreate';
import QueryStateGate from '@components/common/QueryStateGate/QueryStateGate';
import type { Inventory } from '@typedef/InventoryType';
import type { Product } from '@typedef/ProductType';
import type { SelectedOrderItem } from '@typedef/SelectedOrderItem';

const OrderCreateContainer = () => {
  const navigate = useNavigate();
  const { notify } = useSnackbar();

  const inventoriesQuery = useInventories();
  const productsQuery = useProducts();
  const { mutate: createOrder, isPending: isCreating } = useCreateOrder();

  const isPending = inventoriesQuery.isPending || productsQuery.isPending;
  const error = inventoriesQuery.error ?? productsQuery.error;

  const productInventoriesInfo = useMemo<Array<[Product, Inventory[]]>>(() => {
    const inventories = inventoriesQuery.data?.inventories ?? [];
    const products = productsQuery.data?.products ?? [];
    return products.map((product) => [
      product,
      inventories.filter((inventory) => inventory.productId === product.id),
    ]);
  }, [inventoriesQuery.data, productsQuery.data]);

  const [selectedItems, setSelectedItems] = useState<SelectedOrderItem[]>([]);

  const isSameItem = (item: SelectedOrderItem, product: Product, inventory: Inventory) =>
    item.product.id === product.id && item.inventory.id === inventory.id;

  const addProductInventoryItem = useCallback((product: Product, inventory: Inventory) => {
    setSelectedItems((prev) => {
      if (prev.some((item) => isSameItem(item, product, inventory))) return prev;
      return [...prev, { product, inventory, quantity: 1 }];
    });
  }, []);

  const removeProductInventoryItem = useCallback((product: Product, inventory: Inventory) => {
    setSelectedItems((prev) => prev.filter((item) => !isSameItem(item, product, inventory)));
  }, []);

  const updateProductInventoryItemQuantity = useCallback(
    (product: Product, inventory: Inventory, delta: number) => {
      setSelectedItems((prev) =>
        prev.flatMap((item) => {
          if (!isSameItem(item, product, inventory)) return [item];
          const next = item.quantity + delta;
          if (next <= 0) return [];
          if (next > inventory.quantity) return [item];
          return [{ ...item, quantity: next }];
        }),
      );
    },
    [],
  );

  const onCreateButtonClicked = useCallback(() => {
    if (selectedItems.length === 0 || isCreating) return;
    const request = {
      items: selectedItems.map(({ inventory, product, quantity }) => ({
        inventoryId: inventory.id,
        productId: product.id,
        skuCode: inventory.skuCode,
        price: product.price,
        quantity,
      })),
    };
    createOrder(request, {
      onSuccess: (response) => {
        notify('주문이 생성되었습니다', 'success');
        navigate({
          to: ROUTE_PATHS.orderDetail,
          search: { id: response.order.id },
        });
      },
      onError: (err) => {
        notify(`주문 생성 실패: ${err.message}`, 'error');
      },
    });
  }, [selectedItems, isCreating, createOrder, notify, navigate]);

  return (
    <QueryStateGate
      isPending={isPending}
      error={error}
      onRetry={() => {
        inventoriesQuery.refetch();
        productsQuery.refetch();
      }}
    >
      <OrderCreate
        productInventoriesInfo={productInventoriesInfo}
        selectedItems={selectedItems}
        isSubmitting={isCreating}
        onCreateButtonClicked={onCreateButtonClicked}
        addProductInventoryItem={addProductInventoryItem}
        removeProductInventoryItem={removeProductInventoryItem}
        updateProductInventoryItemQuantity={updateProductInventoryItemQuantity}
      />
    </QueryStateGate>
  );
};

export default OrderCreateContainer;
