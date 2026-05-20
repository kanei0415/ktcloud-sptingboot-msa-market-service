import { useOrders } from '@services/rest-api/order-service';
import Order from '../Order';
import QueryStateGate from '@components/common/QueryStateGate/QueryStateGate';

const OrderContainer = () => {
  const { data, isPending, error, refetch } = useOrders();

  return (
    <QueryStateGate isPending={isPending} error={error} onRetry={() => refetch()}>
      <Order orders={data?.orders ?? []} />
    </QueryStateGate>
  );
};

export default OrderContainer;
