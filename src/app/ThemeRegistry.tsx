'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme/theme';

/**
 * Client component wrapper that provides the MUI ThemeProvider and CssBaseline.
 * Separated from the root layout because ThemeProvider requires 'use client'.
 */
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
