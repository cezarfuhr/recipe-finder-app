import React from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Badge,
} from '@mui/material';
import {
  Home,
  Favorite,
  ShoppingCart,
} from '@mui/icons-material';
import { useRecipeStore } from '../stores/useRecipeStore';

export const Layout: React.FC = () => {
  const { shoppingList } = useRecipeStore();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Recipe Finder
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<Home />}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/favorites"
            startIcon={<Favorite />}
          >
            Favorites
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/shopping-list"
            startIcon={
              <Badge badgeContent={shoppingList.length} color="error">
                <ShoppingCart />
              </Badge>
            }
          >
            Shopping List
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Recipe Finder App © {new Date().getFullYear()}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
