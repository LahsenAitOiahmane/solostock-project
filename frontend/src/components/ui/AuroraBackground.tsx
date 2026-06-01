import React from 'react';
import { Box } from '@mui/material';
import { solostock } from '../../theme';

interface BlobConfig {
  color: string;
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  reverse?: boolean;
  slow?: boolean;
}

interface AuroraBackgroundProps {
  blobs?: BlobConfig[]; // Kept for backwards compatibility but unused
  animated?: boolean;
  children?: React.ReactNode;
}

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ children }) => (
  <Box
    sx={{
      position: 'relative',
      overflow: 'hidden',
      minHeight: '100%',
      backgroundColor: solostock.bg.default,
    }}
  >
    <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
  </Box>
);

export default AuroraBackground;
export type { BlobConfig, AuroraBackgroundProps };
