import { createTheme } from '@mui/material/styles';

export const solostock = {
  bg: {
    default: '#FAFAFA',
    secondary: '#FFFFFF',
    tertiary: '#F4F4F5',
  },
  border: {
    default: 'rgba(0, 0, 0, 0.08)',
    subtle: 'rgba(0, 0, 0, 0.04)',
    strong: '#D1D5DB',
  },
  text: {
    primary: '#09090B',
    secondary: '#3F3F46',
    muted: '#71717A',
  },
  accent: {
    blue: '#c1f11d', // Now Lime Green
    green: '#10B981',
    pink: '#F43F5E',
    orange: '#F59E0B',
    cyan: '#06B6D4',
  }
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: solostock.accent.blue,
      contrastText: solostock.text.primary,
    },
    secondary: {
      main: solostock.accent.cyan,
    },
    success: { main: solostock.accent.green },
    warning: { main: solostock.accent.orange },
    error: { main: solostock.accent.pink },
    background: {
      default: solostock.bg.default,
      paper: solostock.bg.secondary,
    },
    text: {
      primary: solostock.text.primary,
      secondary: solostock.text.secondary,
      disabled: solostock.text.muted,
    },
    divider: solostock.border.default,
  },
  typography: {
    fontFamily: '"DM Sans", "Inter", sans-serif',
    h1: {
      fontFamily: '"Plus Jakarta Sans", "DM Sans", sans-serif',
      fontWeight: 800,
    },
    h2: {
      fontFamily: '"Plus Jakarta Sans", "DM Sans", sans-serif',
      fontWeight: 800,
    },
    h3: {
      fontFamily: '"Plus Jakarta Sans", "DM Sans", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Plus Jakarta Sans", "DM Sans", sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Plus Jakarta Sans", "DM Sans", sans-serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Plus Jakarta Sans", "DM Sans", sans-serif',
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '2px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          color: solostock.text.primary,
          '&:hover': {
            backgroundColor: '#aee019',
          }
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '2px',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '2px',
        }
      }
    }
  },
});