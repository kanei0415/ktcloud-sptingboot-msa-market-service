import OrderContainer from '@components/Order/containers/OrderContainer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/orders')({
  component: OrderContainer,
})