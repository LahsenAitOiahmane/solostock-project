import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Alert,
  InputAdornment, IconButton, CircularProgress, alpha,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import CheckIcon from '@mui/icons-material/Check';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AuthResponse, User } from '../types';
import { solostock } from '../theme';

const LIME = solostock.accent.blue;
const GREEN = solostock.accent.green;
const CYAN = solostock.accent.cyan;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>('/api/auth/login', { email, password });
      const { token, user, role, fullName } = res.data;
      const userData: User = user || {
        id: 0, email, fullName: fullName || email, company: '', phone: '', role: (role as User['role']) || 'ACHETEUR',
      };
      login(token, userData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { text: 'Access 12,400+ wholesale products', color: LIME },
    { text: 'Negotiate directly with verified suppliers', color: CYAN },
    { text: 'Track all offers and payments in one place', color: GREEN },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient blobs */}
      <Box sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <Box className="hero-blob" sx={{ position: 'absolute', top: '-20%', left: '-10%', width: 500, height: 500, bgcolor: alpha(LIME, 0.08), filter: 'blur(80px)' }} />
        <Box className="hero-blob" sx={{ position: 'absolute', bottom: '-10%', right: '-10%', width: 400, height: 400, bgcolor: alpha(CYAN, 0.07), filter: 'blur(80px)', animationDelay: '3s' }} />
      </Box>

      {/* ── Left Panel: Branding ── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '48%',
          minHeight: '100vh',
          bgcolor: '#0A0A0A',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {/* Decorative grid */}
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(193,241,29,0.12) 1px, transparent 1px)', backgroundSize: '28px 28px', zIndex: 0 }} />
        {/* Lime accent blob */}
        <Box className="hero-blob" sx={{ position: 'absolute', top: '10%', right: '-20%', width: 400, height: 400, bgcolor: alpha(LIME, 0.15), filter: 'blur(80px)', zIndex: 0 }} />

        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 1 }} className="animate-fade-in">
          <Box sx={{ width: 40, height: 40, borderRadius: '2px', bgcolor: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <StorefrontOutlinedIcon sx={{ color: '#000', fontSize: 22 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff', fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.02em' }}>
            Solostock
          </Typography>
        </Box>

        {/* Main copy */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box className="animate-fade-in-up animate-delay-1" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.8, borderRadius: '2px', bgcolor: alpha(LIME, 0.15), border: `1px solid ${alpha(LIME, 0.3)}`, mb: 3 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: LIME }} />
            <Typography sx={{ color: LIME, fontSize: '0.78rem', fontWeight: 600 }}>Morocco's B2B Marketplace</Typography>
          </Box>
          <Typography variant="h1" className="animate-fade-in-up animate-delay-2" sx={{ fontSize: { md: '2.6rem', lg: '3.2rem' }, fontWeight: 800, color: '#fff', lineHeight: 1.1, mb: 3, letterSpacing: '-0.03em' }}>
            The future of{' '}
            <Box component="span" sx={{ color: LIME }}>B2B</Box>
            {' '}wholesale commerce.
          </Typography>
          <Typography className="animate-fade-in-up animate-delay-3" sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', lineHeight: 1.7, mb: 5 }}>
            Connect with verified suppliers, negotiate in real time, and grow your business on one unified platform.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {perks.map((p, i) => (
              <Box key={p.text} className={`animate-fade-in-up animate-delay-${i + 4}`} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: alpha(p.color, 0.2), border: `1px solid ${alpha(p.color, 0.4)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckIcon sx={{ fontSize: 12, color: p.color }} />
                </Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>{p.text}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Stat strip */}
        <Box className="animate-fade-in-up animate-delay-7" sx={{ display: 'flex', gap: 4, pt: 4, borderTop: `1px solid rgba(255,255,255,0.08)`, position: 'relative', zIndex: 1 }}>
          {[{ val: '5,200+', label: 'Active Users' }, { val: '3,800+', label: 'Deals Closed' }, { val: '12,400+', label: 'Products' }].map(s => (
            <Box key={s.label}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#fff', fontFamily: '"Plus Jakarta Sans", sans-serif', lineHeight: 1 }}>{s.val}</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', mt: 0.5 }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Right Panel: Form ── */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 3, sm: 6 }, position: 'relative', zIndex: 1 }}>
        <Box className="animate-fade-in-up" sx={{ width: '100%', maxWidth: 440 }}>
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 6 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '2px', bgcolor: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <StorefrontOutlinedIcon sx={{ color: '#000', fontSize: 20 }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: solostock.text.primary, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Solostock</Typography>
          </Box>

          <Box sx={{ mb: 6 }}>
            <Typography variant="h2" sx={{ fontSize: '2rem', fontWeight: 800, color: solostock.text.primary, mb: 1, letterSpacing: '-0.02em' }}>
              Welcome back 👋
            </Typography>
            <Typography sx={{ color: solostock.text.muted, fontSize: '0.95rem' }}>
              Sign in to your account to continue.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '2px', bgcolor: alpha(solostock.accent.pink, 0.06), border: `1px solid ${alpha(solostock.accent.pink, 0.2)}`, color: solostock.accent.pink, '& .MuiAlert-icon': { color: solostock.accent.pink } }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth label="Email address" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              required autoComplete="email"
              InputProps={{ startAdornment: (<InputAdornment position="start"><EmailOutlinedIcon sx={{ color: solostock.text.muted, fontSize: 20 }} /></InputAdornment>) }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '2px', '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: LIME }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: LIME, borderWidth: 2 } } }}
            />
            <TextField
              fullWidth label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required autoComplete="current-password"
              InputProps={{
                startAdornment: (<InputAdornment position="start"><LockOutlinedIcon sx={{ color: solostock.text.muted, fontSize: 20 }} /></InputAdornment>),
                endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">{showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}</IconButton></InputAdornment>),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '2px', '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: LIME }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: LIME, borderWidth: 2 } } }}
            />

            <Button
              type="submit" fullWidth variant="contained" size="large"
              disabled={loading}
              endIcon={!loading && <ArrowForwardIcon />}
              sx={{
                mt: 1, py: 1.6, fontSize: '1rem', fontWeight: 700,
                bgcolor: LIME, color: '#000',
                '&:hover': { bgcolor: '#aee019', transform: 'translateY(-1px)', boxShadow: `0 8px 24px ${alpha(LIME, 0.35)}` },
                '&:disabled': { bgcolor: alpha(LIME, 0.4), color: 'rgba(0,0,0,0.4)' },
                transition: 'all 0.2s',
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: '#000' }} /> : 'Sign In'}
            </Button>
          </Box>

          <Typography sx={{ textAlign: 'center', mt: 4, color: solostock.text.secondary, fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <RouterLink to="/register" style={{ color: LIME, fontWeight: 700, textDecoration: 'none' }}>
              Create one free →
            </RouterLink>
          </Typography>

          {/* Demo accounts */}
          <Box sx={{ mt: 5, p: 3, bgcolor: solostock.bg.tertiary, borderRadius: '2px', border: `1px solid ${solostock.border.default}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: solostock.text.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                🔑 Demo Accounts
              </Typography>
              <Typography sx={{ fontSize: '0.68rem', color: solostock.text.muted }}>
                password: <strong>password123</strong>
              </Typography>
            </Box>
            {[
              { label: 'Admin',     email: 'admin@solostock.ma',    color: solostock.accent.pink, badge: 'ADMIN' },
              { label: 'Youssef (Supplier)', email: 'supplier1@solostock.ma', color: CYAN,  badge: 'FOURNISSEUR' },
              { label: 'Fatima (Supplier)', email: 'supplier2@solostock.ma', color: CYAN,  badge: 'FOURNISSEUR' },
              { label: 'Sara (Buyer)',     email: 'buyer1@solostock.ma',   color: LIME,  badge: 'ACHETEUR' },
              { label: 'Karim (Buyer)',    email: 'buyer2@solostock.ma',   color: LIME,  badge: 'ACHETEUR' },
            ].map(acc => (
              <Box
                key={acc.email}
                onClick={() => { setEmail(acc.email); setPassword('password123'); }}
                sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  px: 1.5, py: 0.9, mb: 0.5, borderRadius: '2px', cursor: 'pointer',
                  bgcolor: 'transparent', transition: 'background-color 0.15s',
                  '&:hover': { bgcolor: solostock.bg.secondary },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: acc.color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: solostock.text.secondary }}>{acc.label}</Typography>
                </Box>
                <Typography sx={{ fontSize: '0.72rem', color: solostock.text.muted, fontFamily: 'monospace' }}>{acc.email}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
