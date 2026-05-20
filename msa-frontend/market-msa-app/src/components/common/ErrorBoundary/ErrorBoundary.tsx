import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Uncaught error:', error, info);
    }
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) return this.props.fallback(error, this.reset);

    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center', maxWidth: 480 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            문제가 발생했습니다
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error.message || '알 수 없는 오류'}
          </Typography>
          <Button variant="contained" onClick={this.reset}>
            다시 시도
          </Button>
        </Stack>
      </Box>
    );
  }
}

export default ErrorBoundary;
