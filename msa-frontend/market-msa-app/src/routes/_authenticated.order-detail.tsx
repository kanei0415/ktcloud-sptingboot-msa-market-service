import { createFileRoute } from '@tanstack/react-router';
import OrderDetailContainer from '@components/OrderDetail/containers/OrderDetailContainer';

interface OrderDetailSearch {
  id: number;
}

export const Route = createFileRoute('/_authenticated/order-detail')({
  validateSearch: (search: Record<string, unknown>): OrderDetailSearch => {
    const rawId = search.id;
    const id =
      typeof rawId === 'number'
        ? rawId
        : typeof rawId === 'string'
          ? Number.parseInt(rawId, 10)
          : NaN;
    if (!Number.isFinite(id) || id <= 0) {
      throw new Error('order-detail requires a positive numeric `id` search param');
    }
    return { id };
  },
  component: OrderDetailRoute,
});

function OrderDetailRoute() {
  const { id } = Route.useSearch();
  return <OrderDetailContainer id={String(id)} />;
}
