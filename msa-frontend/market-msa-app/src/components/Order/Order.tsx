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
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { AddCircleOutlineOutlined } from '@mui/icons-material';
import type { Order as OrderModel } from '@typedef/OrderType';
import { ROUTE_PATHS } from '@libs/route-config';
import { palette } from '@libs/theme';
import { ButtonLink } from '@libs/router-link';
import { getOrderStatusVisual } from './order-status';

interface Props {
  orders: OrderModel[];
}

const Order = ({ orders }: Props) => {
  return (
    <Box sx={{ p: 3, bgcolor: palette.surface, minHeight: '100vh' }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 4, alignItems: 'center', justifyContent: 'end' }}
      >
        <Box sx={{ p: 1, bgcolor: palette.navy, borderRadius: 2 }}>
          <ReceiptLongOutlinedIcon sx={{ color: palette.sky }} />
        </Box>
        <Typography variant="h5" color={palette.navy} sx={{ fontWeight: 800 }}>
          주문 및 구독 내역
        </Typography>
        <ButtonLink
          to={ROUTE_PATHS.orderCreate}
          variant="contained"
          startIcon={<AddCircleOutlineOutlined />}
          sx={{
            bgcolor: palette.skyDark,
            '&:hover': { bgcolor: '#0284c7' },
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
          }}
        >
          새 주문 생성
        </ButtonLink>
      </Stack>

      {orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">주문 내역이 없습니다</Typography>
        </Box>
      ) : (
        <Stack spacing={4}>
          {orders.map((order) => {
            const orderStatus = getOrderStatusVisual(order.status);
            const totalAmount = order.orderLineItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0,
            );

            return (
              <Card
                key={order.id}
                sx={{
                  borderRadius: 4,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Typography
                      variant="subtitle1"
                      color="#475569"
                      sx={{ fontWeight: 700 }}
                    >
                      주문 번호:{' '}
                      <Box component="span" sx={{ color: palette.skyDark }}>
                        #{order.id}
                      </Box>
                    </Typography>
                    <Chip
                      label={orderStatus.label}
                      color={orderStatus.color}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Typography variant="h6" color={palette.navy} sx={{ fontWeight: 800 }}>
                      총 {totalAmount.toLocaleString()}원
                    </Typography>
                    <ButtonLink
                      to={ROUTE_PATHS.orderDetail}
                      search={{ id: order.id }}
                      variant="text"
                      size="small"
                    >
                      상세보기
                    </ButtonLink>
                  </Stack>
                </Box>

                <CardContent sx={{ p: 0 }}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: '#fcfcfd' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>상품 정보</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>SKU</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b' }}>
                            단가
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b' }}>
                            수량
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b' }}>
                            합계
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.orderLineItems.map((item, idx) => (
                          <TableRow
                            key={`${order.id}-${idx}`}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell sx={{ py: 2 }}>
                              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                <ShoppingBagOutlinedIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
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
      )}
    </Box>
  );
};

export default Order;
