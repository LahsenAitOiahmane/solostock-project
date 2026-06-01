import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface GradientTextProps {
  gradient?: string;
  children: React.ReactNode;
  component?: React.ElementType;
  sx?: SxProps<Theme>;
}

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)';

const GradientText: React.FC<GradientTextProps> = ({
  gradient = DEFAULT_GRADIENT,
  children,
  component = 'span',
  sx = {},
}) => (
  <Box
    component={component}
    sx={{
      background: gradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      display: 'inline',
      ...sx,
    }}
  >
    {children}
  </Box>
);

export default GradientText;
