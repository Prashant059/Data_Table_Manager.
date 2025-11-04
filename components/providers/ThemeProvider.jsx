'use client';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';

export default function ThemeProvider({ children }) {
  const themeMode = useSelector((state) => state.theme.mode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
        },
        typography: {
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              },
            },
          },
        },
      }),
    [themeMode]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
