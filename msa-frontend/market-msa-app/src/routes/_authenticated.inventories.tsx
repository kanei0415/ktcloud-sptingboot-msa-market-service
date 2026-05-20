import { createFileRoute } from '@tanstack/react-router';
import InventoryContainer from '@components/Inventory/containers/InventoryContainer';

export const Route = createFileRoute('/_authenticated/inventories')({
  component: InventoryContainer,
});
