'use client';

import { useSelector, useDispatch } from 'react-redux';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Tooltip
} from '@mui/material';
import { DarkMode, LightMode, TableView } from '@mui/icons-material';
import { toggleTheme } from '../lib/features/theme/themeSlice';

export default function AppHeader() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TableView color="inherit" sx={{ fontSize: 28 }} />
            <Typography variant="h6" component="div" noWrap>
              Dynamic Data Table Manager
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleThemeToggle}
              aria-label="toggle theme"
              sx={{
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'rotate(180deg)',
                },
              }}
            >
              {themeMode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
