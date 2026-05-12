import OrderCreateContainer from '@components/OrderCreate/containers/OrderCreateContainer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/order-create')({
  component: OrderCreateContainer,
})