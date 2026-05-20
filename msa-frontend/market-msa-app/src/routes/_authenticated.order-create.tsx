import { createFileRoute } from '@tanstack/react-router';
import OrderCreateContainer from '@components/OrderCreate/containers/OrderCreateContainer';

export const Route = createFileRoute('/_authenticated/order-create')({
  component: OrderCreateContainer,
});
