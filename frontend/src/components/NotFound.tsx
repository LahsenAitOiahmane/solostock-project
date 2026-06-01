import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AuroraBackground from './ui/AuroraBackground';
import GradientText from './ui/GradientText';
import { solostock } from '../theme';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

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
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 800,
              fontSize: '8rem',
              lineHeight: 1,
              mb: 1,
            }}
          >
            <GradientText>404</GradientText>
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
            Page not found
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: solostock.text.muted,
              mb: 4,
              lineHeight: 1.7,
            }}
          >
            The page you're looking for doesn't exist or has been moved.
          </Typography>
          <Button
            variant="contained"
            startIcon={<HomeOutlinedIcon />}
            onClick={() => navigate('/dashboard')}
            size="large"
          >
            Go to Dashboard
          </Button>
        </Box>
      </Box>
    </AuroraBackground>
  );
};

export default NotFound;
