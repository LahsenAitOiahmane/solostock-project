import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AuroraBackground from './ui/AuroraBackground';
import { solostock } from '../theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <AuroraBackground>
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 3,
            }}
          >
            <Box sx={{ textAlign: 'center', maxWidth: 480 }}>
              <Typography
                sx={{
                  fontSize: '4rem',
                  mb: 2,
                }}
              >
                💥
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  color: solostock.text.primary,
                  mb: 1,
                  fontWeight: 700,
                  fontSize: '1.75rem',
                }}
              >
                Something went wrong
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: solostock.text.muted,
                  mb: 4,
                  lineHeight: 1.7,
                }}
              >
                An unexpected error occurred. Please try reloading the page.
                If the problem persists, contact support.
              </Typography>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleReload}
                size="large"
              >
                Reload Page
              </Button>
            </Box>
          </Box>
        </AuroraBackground>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
