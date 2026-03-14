'use client';

import { createTheme } from '@mui/material/styles';

/**
 * MUI dark theme with cosmic neon color palette.
 * Primary: neon blue (#00d4ff), Secondary: neon purple (#b24bff).
 * Overrides input borders with neon glow focus states and
 * sets pill-shaped buttons with no text-transform.
 */
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00d4ff',
    },
    secondary: {
      main: '#b24bff',
    },
    background: {
      default: '#0a0a1a',
      paper: '#1a1a2e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#8892b0',
    },
  },
  typography: {
    fontFamily: 'var(--font-inter), sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0a0a1a',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 212, 255, 0.3)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 212, 255, 0.6)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00d4ff',
            boxShadow: '0 0 10px rgba(0, 212, 255, 0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 50,
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
