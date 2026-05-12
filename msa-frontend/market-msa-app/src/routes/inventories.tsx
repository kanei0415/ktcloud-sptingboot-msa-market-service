import InventoryContainer from '@components/Inventory/containers/InventoryContainer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/inventories')({
  component: InventoryContainer,
})