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
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  DashboardOutlined as DashboardIcon,
  Inventory2Outlined as InventoryIcon,
  ShoppingCartOutlined as OrderIcon,
  CloudOutlined as ProductIcon,
  LoginOutlined as LoginIcon,
  PersonAddOutlined as SignUpIcon,
} from '@mui/icons-material';
import { Link } from '@tanstack/react-router';

const DRAWER_WIDTH = 260;

const SideBar = () => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  // 메뉴 구성 데이터
  const menuItems = [
    { text: '메인', icon: <DashboardIcon />, to: '/' },
    { text: '상품 목록', icon: <ProductIcon />, to: '/products' },
    { text: '주문 내역', icon: <OrderIcon />, to: '/orders' },
    { text: '재고 관리', icon: <InventoryIcon />, to: '/inventories' },
  ];

  const authItems = [
    { text: '로그인', icon: <LoginIcon />, to: '/sign-in' },
    { text: '회원가입', icon: <SignUpIcon />, to: '/sign-up' },
  ];

  return (
    <>
      {!open && (
        <IconButton
          onClick={toggleDrawer}
          sx={{ position: 'fixed', left: 16, top: 16, zIndex: 1201, bgcolor: 'white', boxShadow: 2 }}
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
            bgcolor: '#102a43',
            color: 'white',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={800} sx={{ color: '#38bdf8', ml: 1 }}>
            KT MARKET
          </Typography>
          <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>

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
                activeProps={{ style: { backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' } }}
                sx={{ borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
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
          {authItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.to}
                sx={{ borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default SideBar;