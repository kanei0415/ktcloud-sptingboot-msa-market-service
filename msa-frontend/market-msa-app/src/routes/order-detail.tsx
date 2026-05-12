import OrderDetailContainer from '@components/OrderDetail/containers/OrderDetailContainer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/order-detail')({
  component: OrderDetailContainer,
})