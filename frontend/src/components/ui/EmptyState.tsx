import React from 'react';
import { Box, Typography, Button, SxProps, Theme } from '@mui/material';
import { solostock } from '../../theme';

interface EmptyStateProps {
  icon?: React.ReactNode;
  message: string;
  description?: string;
  ctaLabel?: string;
  onCta?: () => void;
  sx?: SxProps<Theme>;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  message,
  description,
  ctaLabel,
  onCta,
  sx = {},
}) => (
  <Box
    sx={{
      textAlign: 'center',
      py: 8,
      px: 3,
      ...sx,
    }}
  >
    {icon && (
      <Box
        sx={{
          fontSize: '3.5rem',
          mb: 2,
          opacity: 0.5,
          filter: 'grayscale(0.5)',
        }}
      >
        {icon}
      </Box>
    )}
    <Typography
      variant="h3"
      sx={{
        color: solostock.text.primary,
        mb: 1,
        fontWeight: 600,
      }}
    >
      {message}
    </Typography>
    {description && (
      <Typography
        variant="body1"
        sx={{
          color: solostock.text.muted,
          maxWidth: 360,
          mx: 'auto',
          mb: ctaLabel ? 3 : 0,
        }}
      >
        {description}
      </Typography>
    )}
    {ctaLabel && onCta && (
      <Button variant="contained" onClick={onCta} size="large">
        {ctaLabel}
      </Button>
    )}
  </Box>
);

export default EmptyState;
