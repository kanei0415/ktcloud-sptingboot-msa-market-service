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
  LinearProgress
} from '@mui/material';
import {
  EditOutlined as EditIcon,
  HistoryOutlined as HistoryIcon,
  Inventory2Outlined as InventoryIcon,
  WarningAmberOutlined as WarningIcon
} from '@mui/icons-material';
import type { Inventory } from "@typedef/InventoryType";

type Props = {
  inventories: Inventory[];
};

const InventoryList = ({ inventories }: Props) => {
  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) return { label: '품절', color: 'error', bg: '#fef2f2' };
    if (quantity <= 10) return { label: '재고 부족', color: 'warning', bg: '#fffbeb' };
    return { label: '정상', color: 'success', bg: '#f0fdf4' };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'row-reverse', justifyContent: 'end', alignItems: 'center', gap: 2 }}>
        <Box sx={{ p: 1.5, bgcolor: '#102a43', borderRadius: 2, }}>
          <InventoryIcon sx={{ color: '#38bdf8' }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#102a43" align='right'>
            재고 현황 확인
          </Typography>
          <Typography variant="body2" color="text.secondary">
            실시간 제품 재고 수량 및 SKU 코드를 확인
          </Typography>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }}>SKU Code</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Product ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="center">수량</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="center">상태</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }} align="center">액션</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventories.map((item) => {
              const status = getStockStatus(item.quantity);
              return (
                <TableRow key={item.id} sx={{ '&:hover': { bgcolor: '#f1f5f9' } }}>
                  <TableCell>#{item.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace', color: '#0ea5e9' }}>
                      {item.skuCode}
                    </Typography>
                  </TableCell>
                  <TableCell color="text.secondary">{item.productId}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ width: '100%', minWidth: 80 }}>
                      <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
                        {item.quantity.toLocaleString()} 개
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min((item.quantity / 100) * 100, 100)}
                        color={status.color as any}
                        sx={{ height: 6, borderRadius: 3, bgcolor: '#e2e8f0' }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={item.quantity <= 10 ? <WarningIcon style={{ fontSize: 16 }} /> : undefined}
                      label={status.label}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        color: `${status.color}.main`,
                        bgcolor: status.bg,
                        border: '1px solid',
                        borderColor: `${status.color}.light`
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="재고 수정">
                      <IconButton size="small" sx={{ mr: 1, color: '#64748b' }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="이력 조회">
                      <IconButton size="small" sx={{ color: '#64748b' }}>
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

export default InventoryList;