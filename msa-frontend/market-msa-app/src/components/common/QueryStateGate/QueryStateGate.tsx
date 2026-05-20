import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  isPending: boolean;
  error: Error | null;
  onRetry?: () => void;
  children: ReactNode;
}

const QueryStateGate = ({ isPending, error, onRetry, children }: Props) => {
  if (isPending) {
    return (
      <Box
        sx={{
          minHeight: 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box
        sx={{
          minHeight: 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            데이터를 불러올 수 없습니다
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error.message}
          </Typography>
          {onRetry && (
            <Button variant="contained" onClick={onRetry}>
              다시 시도
            </Button>
          )}
        </Stack>
      </Box>
    );
  }
  return children;
};

export default QueryStateGate;
