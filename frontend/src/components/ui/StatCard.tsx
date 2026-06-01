import React from 'react';
import { Box, Typography, Skeleton, SxProps, Theme, alpha } from '@mui/material';
import { solostock } from '../../theme';

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  sx?: SxProps<Theme>;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  color = solostock.accent.blue,
  icon,
  loading = false,
  sx = {},
}) => (
  <Box
    sx={{
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: solostock.bg.secondary,
      border: `1px solid ${solostock.border.default}`,
      borderLeft: `4px solid ${color}`,
      borderRadius: '2px',
      padding: '22px 20px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        borderColor: solostock.border.strong,
        borderLeftColor: color,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      },
      ...sx,
    }}
    className="animate-fade-in-up"
  >
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {icon && (
          <Box sx={{ color, display: 'flex', fontSize: '1.1rem' }}>
            {icon}
          </Box>
        )}
        <Typography
          variant="caption"
          sx={{
            color: solostock.text.muted,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 600,
          }}
        >
          {label}
        </Typography>
      </Box>
      {loading ? (
        <Skeleton
          variant="text"
          width="60%"
          sx={{ fontSize: '1.75rem' }}
        />
      ) : (
        <Typography
          sx={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: solostock.text.primary,
            lineHeight: 1.2,
            fontFamily: '"Plus Jakarta Sans", sans-serif',
          }}
        >
          {value}
        </Typography>
      )}
    </Box>
  </Box>
);

export default StatCard;
