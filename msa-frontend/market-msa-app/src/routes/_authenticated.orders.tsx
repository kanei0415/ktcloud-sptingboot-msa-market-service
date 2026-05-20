import { createFileRoute } from '@tanstack/react-router';
import OrderContainer from '@components/Order/containers/OrderContainer';

export const Route = createFileRoute('/_authenticated/orders')({
  component: OrderContainer,
});
