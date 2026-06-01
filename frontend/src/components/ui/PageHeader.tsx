import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Box, Typography, Button, SxProps, Theme } from '@mui/material';
import { solostock } from '../../theme';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
  badge?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onAction,
  badge,
  sx = {},
}) => {
  const [targetNode, setTargetNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // The Layout component renders this element before any page renders
    const el = document.getElementById('page-header-portal');
    setTargetNode(el);
  }, []);

  const content = (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        animation: 'fadeIn 0.3s ease',
        ...sx,
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1rem', md: '1.15rem' },
              color: solostock.text.primary,
              margin: 0,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {title}
          </Typography>
          {badge}
        </Box>
        {subtitle && (
          <Typography
            variant="body2"
            sx={{ 
              color: solostock.text.muted, 
              fontSize: '0.75rem', 
              mt: 0.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {actionLabel && onAction && (
        <Button
          variant="contained"
          onClick={onAction}
          startIcon={actionIcon}
          size="small"
          sx={{ flexShrink: 0, ml: 2, height: 32 }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );

  if (targetNode) {
    return ReactDOM.createPortal(content, targetNode);
  }

  return null;
};

export default PageHeader;
