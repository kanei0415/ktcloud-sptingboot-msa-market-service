import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Typography,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  DashboardOutlined as DashboardIcon,
  Inventory2Outlined as InventoryIcon,
  ShoppingCartOutlined as OrderIcon,
  CloudOutlined as ProductIcon,
  LogoutOutlined as LogoutIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from '@tanstack/react-router';
import { ROUTE_PATHS } from '@libs/route-config';
import { useAuthStore, selectUser } from '@store/useAuthStore';
import { useSignOut } from '@services/rest-api/auth-service';
import { useSnackbar } from '@components/common/Snackbar/snackbar-context';
import { palette } from '@libs/theme';

export const DRAWER_WIDTH = 260;

const menuItems = [
  { text: '메인', icon: <DashboardIcon />, to: ROUTE_PATHS.index },
  { text: '상품 목록', icon: <ProductIcon />, to: ROUTE_PATHS.products },
  { text: '주문 내역', icon: <OrderIcon />, to: ROUTE_PATHS.orders },
  { text: '재고 관리', icon: <InventoryIcon />, to: ROUTE_PATHS.inventories },
] as const;

const SideBar = () => {
  const [open, setOpen] = useState(true);
  const user = useAuthStore(selectUser);
  const signOut = useSignOut();
  const navigate = useNavigate();
  const { notify } = useSnackbar();

  const toggleDrawer = () => setOpen((v) => !v);

  const handleSignOut = () => {
    signOut();
    notify('로그아웃 되었습니다', 'info');
    navigate({ to: ROUTE_PATHS.signIn });
  };

  return (
    <>
      {!open && (
        <IconButton
          onClick={toggleDrawer}
          aria-label="사이드바 열기"
          sx={{
            position: 'fixed',
            left: 16,
            top: 16,
            zIndex: 1201,
            bgcolor: 'background.paper',
            boxShadow: 2,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: palette.navy,
            color: 'white',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: palette.sky, ml: 1, fontWeight: 800 }}
          >
            KT MARKET
          </Typography>
          <IconButton onClick={toggleDrawer} aria-label="사이드바 닫기" sx={{ color: 'white' }}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

        {user && (
          <Stack direction="row" spacing={2} sx={{ px: 2, py: 2, alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: palette.sky, color: palette.navy, fontWeight: 700 }}>
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
                {user.name}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }} noWrap>
                {user.email}
              </Typography>
            </Box>
          </Stack>
        )}

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

        <List sx={{ px: 1, mt: 2 }}>
          <Typography variant="caption" sx={{ px: 2, opacity: 0.5, fontWeight: 700 }}>
            SERVICES
          </Typography>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mt: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.to}
                activeProps={{
                  style: {
                    backgroundColor: 'rgba(56, 189, 248, 0.2)',
                    color: palette.sky,
                  },
                }}
                sx={{
                  borderRadius: 2,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

        <List sx={{ px: 1, mb: 2 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleSignOut}
              sx={{
                borderRadius: 2,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="로그아웃" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default SideBar;
