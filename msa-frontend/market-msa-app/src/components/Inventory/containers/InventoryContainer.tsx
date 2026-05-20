import { useInventories } from '@services/rest-api/inventory-service';
import Inventory from '../Inventory';
import QueryStateGate from '@components/common/QueryStateGate/QueryStateGate';

const InventoryContainer = () => {
  const { data, isPending, error, refetch } = useInventories();

  return (
    <QueryStateGate isPending={isPending} error={error} onRetry={() => refetch()}>
      <Inventory inventories={data?.inventories ?? []} />
    </QueryStateGate>
  );
};

export default InventoryContainer;
