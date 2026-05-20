import { useOrder } from '@services/rest-api/order-service';
import OrderDetail from '../OrderDetail';
import QueryStateGate from '@components/common/QueryStateGate/QueryStateGate';

interface Props {
  id: string;
}

const OrderDetailContainer = ({ id }: Props) => {
  const { data, isPending, error, refetch } = useOrder(id);

  return (
    <QueryStateGate isPending={isPending} error={error} onRetry={() => refetch()}>
      {data && <OrderDetail order={data.order} />}
    </QueryStateGate>
  );
};

export default OrderDetailContainer;
