import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import type { Order } from "@typedef/OrderType";
import { Link } from '@tanstack/react-router';
import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { ROUTE_PATHS } from '@libs/route-config';

type Props = {
  orders: Order[];
};

const OrderList = ({ orders }: Props) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return { color: 'success', label: '결제 완료' };
      case 'pending': return { color: 'warning', label: '결제 대기' };
      case 'shipped': return { color: 'info', label: '배송 중' };
      default: return { color: 'default', label: status };
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Stack direction="row" spacing={2} sx={{ mb: 4, alignItems: 'center', justifyContent: 'end' }}>
        <Box sx={{ p: 1, bgcolor: '#102a43', borderRadius: 2 }}>
          <ReceiptLongOutlinedIcon sx={{ color: '#38bdf8' }} />
        </Box>
        <Typography variant="h5" fontWeight={800} color="#102a43">
          주문 및 구독 내역
        </Typography>
        <Box component={Link} to={ROUTE_PATHS.orderCreate}>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineOutlined />}

            sx={{
              bgcolor: '#0ea5e9',
              '&:hover': { bgcolor: '#0284c7' },
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)'
            }}
          >
            새 주문 생성
          </Button>
        </Box>
      </Stack>

      <Stack spacing={4}>
        {orders.map((order) => {
          const orderStatus = getStatusColor(order.status);

          const totalAmount = order.orderLineItems.reduce(
            (sum, item) => sum + (item.price * item.quantity), 0
          );

          return (
            <Card key={order.id} sx={{ borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <Box sx={{ p: 2, bgcolor: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="subtitle1" fontWeight={700} color="#475569">
                    주문 번호: <span style={{ color: '#0ea5e9' }}>#{order.id}</span>
                  </Typography>
                  <Chip
                    label={orderStatus.label}
                    color={orderStatus.color as any}
                    size="small"
                    variant="soft"
                    sx={{ fontWeight: 700 }}
                  />
                </Stack>
                <Typography variant="h6" fontWeight={800} color="#102a43">
                  총 {totalAmount.toLocaleString()}원
                </Typography>
              </Box>

              <CardContent sx={{ p: 0 }}>
                <TableContainer>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#fcfcfd' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>상품 정보</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>SKU</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b' }}>단가</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b' }}>수량</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b' }}>합계</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.orderLineItems.map((item, idx) => (
                        <TableRow key={`${order.id}-${idx}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ py: 2 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <ShoppingBagOutlinedIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                              <Typography variant="body2" fontWeight={600}>{item.productId}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#64748b' }}>
                              {item.skuCode}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">{item.price.toLocaleString()}원</TableCell>
                          <TableCell align="right">{item.quantity}개</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>
                            {(item.price * item.quantity).toLocaleString()}원
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
};

export default OrderList;