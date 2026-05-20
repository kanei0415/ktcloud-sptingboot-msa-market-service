import { useEffect } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '@libs/theme';
import { router } from '@libs/router';
import { setUnauthorizedHandler } from '@libs/auth-events';
import { useAuthStore } from '@store/useAuthStore';
import ErrorBoundary from '@components/common/ErrorBoundary/ErrorBoundary';
import { SnackbarProvider } from '@components/common/Snackbar/SnackbarProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

function UnauthorizedBridge() {
  useEffect(() => {
    setUnauthorizedHandler(() => {
      useAuthStore.getState().clearAuth();
      queryClient.clear();
      router.navigate({ to: '/sign-in' });
    });
    return () => setUnauthorizedHandler(null);
  }, []);
  return null;
}

const TanStackProvider = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider>
            <UnauthorizedBridge />
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </SnackbarProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default TanStackProvider;
