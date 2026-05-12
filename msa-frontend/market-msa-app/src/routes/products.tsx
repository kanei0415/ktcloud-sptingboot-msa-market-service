import ProductContainer from '@components/Product/containers/ProductContainer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/products')({
  component: ProductContainer,
})