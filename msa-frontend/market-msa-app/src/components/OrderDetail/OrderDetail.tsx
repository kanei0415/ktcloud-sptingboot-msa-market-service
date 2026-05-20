import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  ReceiptLongOutlined,
  ShoppingBagOutlined,
  ArrowBackOutlined,
} from '@mui/icons-material';
import { ROUTE_PATHS } from '@libs/route-config';
import { palette } from '@libs/theme';
import { ButtonLink } from '@libs/router-link';
import { getOrderStatusVisual } from '@components/Order/order-status';
import type { Order } from '@typedef/OrderType';

interface Props {
  order: Order;
}

const OrderDetail = ({ order }: Props) => {
  const statusVisual = getOrderStatusVisual(order.status);
  const totalAmount = order.orderLineItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack
        direction="row"
        sx={{ mb: 3, alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Box sx={{ p: 1, bgcolor: palette.navy, borderRadius: 2 }}>
            <ReceiptLongOutlined sx={{ color: palette.sky }} />
          </Box>
          <Box>
            <Typography variant="h5" color={palette.navy} sx={{ fontWeight: 800 }}>
              주문 상세
            </Typography>
            <Typography variant="body2" color="text.secondary">
              주문 번호 #{order.id}
            </Typography>
          </Box>
        </Stack>
        <ButtonLink
          to={ROUTE_PATHS.orders}
          variant="outlined"
          startIcon={<ArrowBackOutlined />}
        >
          목록으로
        </ButtonLink>
      </Stack>

      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <CardContent>
          <Stack
            direction="row"
            sx={{ mb: 2, alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Chip label={statusVisual.label} color={statusVisual.color} sx={{ fontWeight: 700 }} />
            <Typography variant="h6" color={palette.navy} sx={{ fontWeight: 800 }}>
              총 {totalAmount.toLocaleString()}원
            </Typography>
          </Stack>
          <Divider sx={{ mb: 2 }} />

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>상품</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>SKU</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b' }}>
                    단가
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b' }}>
                    수량
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b' }}>
                    상태
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b' }}>
                    합계
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.orderLineItems.map((item, idx) => {
                  const lineStatus = getOrderStatusVisual(item.status);
                  return (
                    <TableRow key={`${order.id}-${idx}`}>
                      <TableCell sx={{ py: 2 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <ShoppingBagOutlined sx={{ fontSize: 18, color: '#94a3b8' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.productId}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="caption"
                          sx={{ fontFamily: 'monospace', color: '#64748b' }}
                        >
                          {item.skuCode}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{item.price.toLocaleString()}원</TableCell>
                      <TableCell align="right">{item.quantity}개</TableCell>
                      <TableCell align="right">
                        <Chip
                          size="small"
                          label={lineStatus.label}
                          color={lineStatus.color}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        {(item.price * item.quantity).toLocaleString()}원
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default OrderDetail;
