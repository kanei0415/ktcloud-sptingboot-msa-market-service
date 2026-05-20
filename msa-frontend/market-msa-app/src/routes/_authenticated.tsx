import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Box } from '@mui/material';
import SideBar, { DRAWER_WIDTH } from '@components/SideBar/SideBar';
import { useAuthStore } from '@store/useAuthStore';
import { ROUTE_PATHS } from '@libs/route-config';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    const token = useAuthStore.getState().token;
    if (!token) {
      throw redirect({
        to: ROUTE_PATHS.signIn,
        search: { redirect: location.href },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <SideBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
