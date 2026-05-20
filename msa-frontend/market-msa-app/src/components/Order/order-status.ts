import type { ChipProps } from '@mui/material';

export interface OrderStatusVisual {
  color: ChipProps['color'];
  label: string;
}

export function getOrderStatusVisual(status: string): OrderStatusVisual {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return { color: 'success', label: '결제 완료' };
    case 'PENDING':
      return { color: 'warning', label: '결제 대기' };
    case 'SHIPPED':
      return { color: 'info', label: '배송 중' };
    case 'CANCELLED':
      return { color: 'error', label: '취소됨' };
    default:
      return { color: 'default', label: status };
  }
}
