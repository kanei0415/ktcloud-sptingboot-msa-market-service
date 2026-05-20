import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { Alert, Snackbar, type AlertColor } from '@mui/material';
import { SnackbarContext, type SnackbarContextValue } from './snackbar-context';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

interface Props {
  children: ReactNode;
}

export function SnackbarProvider({ children }: Props) {
  const [state, setState] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info',
  });

  const notify = useCallback((message: string, severity: AlertColor = 'info') => {
    setState({ open: true, message, severity });
  }, []);

  const handleClose = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const value = useMemo<SnackbarContextValue>(() => ({ notify }), [notify]);

  return (
    <SnackbarContext value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={state.severity} variant="filled" sx={{ width: '100%' }}>
          {state.message}
        </Alert>
      </Snackbar>
    </SnackbarContext>
  );
}
