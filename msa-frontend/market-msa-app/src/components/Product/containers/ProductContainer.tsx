import { useProducts } from '@services/rest-api/product-service';
import Product from '../Product';
import QueryStateGate from '@components/common/QueryStateGate/QueryStateGate';

const ProductContainer = () => {
  const { data, isPending, error, refetch } = useProducts();

  return (
    <QueryStateGate isPending={isPending} error={error} onRetry={() => refetch()}>
      <Product products={data?.products ?? []} />
    </QueryStateGate>
  );
};

export default ProductContainer;
