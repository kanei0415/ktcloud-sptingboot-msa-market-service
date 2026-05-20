import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  EditOutlined as EditIcon,
  HistoryOutlined as HistoryIcon,
  Inventory2Outlined as InventoryIcon,
  WarningAmberOutlined as WarningIcon,
} from '@mui/icons-material';
import type { ChipProps, LinearProgressProps } from '@mui/material';
import type { Inventory as InventoryModel } from '@typedef/InventoryType';
import { palette } from '@libs/theme';

type StockStatusColor = Extract<
  NonNullable<LinearProgressProps['color']> & NonNullable<ChipProps['color']>,
  'success' | 'warning' | 'error'
>;

interface StockStatus {
  label: string;
  color: StockStatusColor;
  bg: string;
}

const getStockStatus = (quantity: number): StockStatus => {
  if (quantity <= 0) return { label: '품절', color: 'error', bg: '#fef2f2' };
  if (quantity <= 10) return { label: '재고 부족', color: 'warning', bg: '#fffbeb' };
  return { label: '정상', color: 'success', bg: '#f0fdf4' };
};

interface Props {
  inventories: InventoryModel[];
}

const Inventory = ({ inventories }: Props) => {
  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: 'row-reverse',
          justifyContent: 'end',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box sx={{ p: 1.5, bgcolor: palette.navy, borderRadius: 2 }}>
          <InventoryIcon sx={{ color: palette.sky }} />
        </Box>
        <Box>
          <Typography
            variant="h5"
            align="right"
            color={palette.navy}
            sx={{ fontWeight: 800 }}
          >
            재고 현황 확인
          </Typography>
          <Typography variant="body2" color="text.secondary">
            실시간 제품 재고 수량 및 SKU 코드를 확인
          </Typography>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: palette.surface }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }}>SKU Code</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Product ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="center">
                수량
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="center">
                상태
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="center">
                액션
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventories.map((item) => {
              const status = getStockStatus(item.quantity);
              return (
                <TableRow key={item.id} sx={{ '&:hover': { bgcolor: '#f1f5f9' } }}>
                  <TableCell>#{item.id}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'monospace', color: palette.skyDark, fontWeight: 600 }}
                    >
                      {item.skuCode}
                    </Typography>
                  </TableCell>
                  <TableCell>{item.productId}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ width: '100%', minWidth: 80 }}>
                      <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 700 }}>
                        {item.quantity.toLocaleString()} 개
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min((item.quantity / 100) * 100, 100)}
                        color={status.color}
                        sx={{ height: 6, borderRadius: 3, bgcolor: palette.border }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={item.quantity <= 10 ? <WarningIcon style={{ fontSize: 16 }} /> : undefined}
                      label={status.label}
                      size="small"
                      color={status.color}
                      variant="outlined"
                      sx={{ fontWeight: 700, bgcolor: status.bg }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="재고 수정">
                      <IconButton size="small" aria-label="재고 수정" sx={{ mr: 1, color: '#64748b' }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="이력 조회">
                      <IconButton size="small" aria-label="이력 조회" sx={{ color: '#64748b' }}>
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Inventory;
