import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { solostock } from '../../theme';

interface GlassCardProps {
  tint?: 'blue' | 'green' | 'pink' | 'orange' | 'cyan' | 'none';
  children: React.ReactNode;
  onClick?: () => void;
  hover?: boolean;
  sx?: SxProps<Theme>;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({
  tint = 'none',
  children,
  onClick,
  hover = true,
  sx = {},
  className,
}) => (
  <Box
    onClick={onClick}
    className={className}
    sx={{
      position: 'relative',
      backgroundColor: solostock.bg.secondary,
      border: `1px solid ${solostock.border.default}`,
      borderRadius: '2px',
      padding: '24px 20px',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      ...(hover
        ? {
            '&:hover': {
              transform: 'translateY(-2px)',
              borderColor: solostock.border.strong,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            },
          }
        : {}),
      ...sx,
    }}
  >
    {/* Content */}
    <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
  </Box>
);

export default GlassCard;
