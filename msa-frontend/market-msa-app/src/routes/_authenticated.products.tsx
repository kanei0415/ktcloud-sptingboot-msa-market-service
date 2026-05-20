import { createFileRoute } from '@tanstack/react-router';
import ProductContainer from '@components/Product/containers/ProductContainer';

export const Route = createFileRoute('/_authenticated/products')({
  component: ProductContainer,
});
