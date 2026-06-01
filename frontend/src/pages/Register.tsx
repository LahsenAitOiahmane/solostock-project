import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Alert,
  InputAdornment, MenuItem, CircularProgress, IconButton, alpha, Chip,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AuthResponse, User } from '../types';
import { solostock } from '../theme';

const LIME = solostock.accent.blue;
const CYAN = solostock.accent.cyan;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: '', password: '', fullName: '', company: '', phone: '',
    role: 'ACHETEUR' as 'FOURNISSEUR' | 'ACHETEUR',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>('/api/auth/register', form);
      const { token, email, fullName, role } = res.data;
      const userData: User = res.data.user || {
        id: 0, email: email || form.email, fullName: fullName || form.fullName,
        company: form.company, phone: form.phone,
        role: (role || form.role) as 'FOURNISSEUR' | 'ACHETEUR',
      };
      login(token, userData);
      navigate('/dashboard');
    } catch (err: any) {
      if (!err.response) {
        setError(`Network error — cannot reach server. Is the backend running?`);
      } else {
        const data = err.response.data;
        const msg = data?.message || data?.error || (typeof data === 'string' ? data : null) || `Server error ${err.response.status}`;
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '2px',
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: LIME },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: LIME, borderWidth: 2 },
    },
  };

  const roleColor = form.role === 'ACHETEUR' ? LIME : CYAN;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient blobs */}
      <Box sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <Box className="hero-blob" sx={{ position: 'absolute', top: '-15%', right: '-10%', width: 500, height: 500, bgcolor: alpha(LIME, 0.07), filter: 'blur(90px)' }} />
        <Box className="hero-blob" sx={{ position: 'absolute', bottom: '-10%', left: '-10%', width: 400, height: 400, bgcolor: alpha(CYAN, 0.07), filter: 'blur(80px)', animationDelay: '2s' }} />
      </Box>

      {/* ── Left Panel: Branding ── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '42%',
          minHeight: '100vh',
          bgcolor: '#0A0A0A',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(193,241,29,0.1) 1px, transparent 1px)', backgroundSize: '28px 28px', zIndex: 0 }} />
        <Box className="hero-blob" sx={{ position: 'absolute', bottom: '0', left: '-30%', width: 500, height: 500, bgcolor: alpha(CYAN, 0.12), filter: 'blur(100px)', zIndex: 0 }} />

        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 1 }} className="animate-fade-in">
          <Box sx={{ width: 40, height: 40, borderRadius: '2px', bgcolor: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <StorefrontOutlinedIcon sx={{ color: '#000', fontSize: 22 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff', fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.02em' }}>
            Solostock
          </Typography>
        </Box>

        {/* Copy */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h2" className="animate-fade-in-up animate-delay-1" sx={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', lineHeight: 1.1, mb: 3, letterSpacing: '-0.03em' }}>
            Start your{' '}
            <Box component="span" sx={{ color: LIME }}>B2B journey</Box>
            {' '}today.
          </Typography>
          <Typography className="animate-fade-in-up animate-delay-2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', lineHeight: 1.7, mb: 6 }}>
            Whether you want to source products or expand your sales, Solostock is built for you.
          </Typography>

          {/* Role Cards */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box className="animate-fade-in-up animate-delay-3" sx={{ p: 3, borderRadius: '2px', border: `1px solid ${alpha(LIME, 0.25)}`, bgcolor: alpha(LIME, 0.06), cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: alpha(LIME, 0.5), bgcolor: alpha(LIME, 0.1) } }}
              onClick={() => setForm(f => ({ ...f, role: 'ACHETEUR' }))}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <ShoppingCartOutlinedIcon sx={{ color: LIME, fontSize: 22 }} />
                <Typography sx={{ color: '#fff', fontWeight: 700 }}>I'm a Buyer</Typography>
                {form.role === 'ACHETEUR' && <Chip label="Selected" size="small" sx={{ ml: 'auto', bgcolor: LIME, color: '#000', fontWeight: 700, height: 20, fontSize: '0.65rem' }} />}
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', lineHeight: 1.5 }}>Browse products and negotiate deals with verified suppliers.</Typography>
            </Box>
            <Box className="animate-fade-in-up animate-delay-4" sx={{ p: 3, borderRadius: '2px', border: `1px solid ${alpha(CYAN, 0.25)}`, bgcolor: alpha(CYAN, 0.06), cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: alpha(CYAN, 0.5), bgcolor: alpha(CYAN, 0.1) } }}
              onClick={() => setForm(f => ({ ...f, role: 'FOURNISSEUR' }))}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <LocalShippingOutlinedIcon sx={{ color: CYAN, fontSize: 22 }} />
                <Typography sx={{ color: '#fff', fontWeight: 700 }}>I'm a Supplier</Typography>
                {form.role === 'FOURNISSEUR' && <Chip label="Selected" size="small" sx={{ ml: 'auto', bgcolor: CYAN, color: '#000', fontWeight: 700, height: 20, fontSize: '0.65rem' }} />}
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', lineHeight: 1.5 }}>List your products and manage wholesale orders at scale.</Typography>
            </Box>
          </Box>
        </Box>

        {/* Bottom stats */}
        <Box className="animate-fade-in-up animate-delay-5" sx={{ display: 'flex', gap: 4, pt: 4, borderTop: `1px solid rgba(255,255,255,0.06)`, position: 'relative', zIndex: 1 }}>
          {[{ val: '5,200+', label: 'Businesses' }, { val: '12k+', label: 'Products' }, { val: 'Free', label: 'To Join' }].map(s => (
            <Box key={s.label}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff', fontFamily: '"Plus Jakarta Sans", sans-serif', lineHeight: 1 }}>{s.val}</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', mt: 0.5 }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Right Panel: Form ── */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 3, sm: 5 }, position: 'relative', zIndex: 1, overflowY: 'auto' }}>
        <Box className="animate-fade-in-up" sx={{ width: '100%', maxWidth: 500, py: 4 }}>
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 6 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '2px', bgcolor: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <StorefrontOutlinedIcon sx={{ color: '#000', fontSize: 20 }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: solostock.text.primary, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Solostock</Typography>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h2" sx={{ fontSize: '2rem', fontWeight: 800, color: solostock.text.primary, mb: 1, letterSpacing: '-0.02em' }}>
              Create your account
            </Typography>
            <Typography sx={{ color: solostock.text.muted, fontSize: '0.9rem' }}>
              Join Morocco's largest B2B marketplace — it's free.
            </Typography>
          </Box>

          {/* Role selector (mobile) */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1.5, mb: 3 }}>
            {(['ACHETEUR', 'FOURNISSEUR'] as const).map(r => (
              <Button
                key={r} size="small" fullWidth
                onClick={() => setForm(f => ({ ...f, role: r }))}
                variant={form.role === r ? 'contained' : 'outlined'}
                sx={{
                  bgcolor: form.role === r ? roleColor : 'transparent',
                  color: form.role === r ? '#000' : solostock.text.secondary,
                  borderColor: form.role === r ? roleColor : solostock.border.default,
                  fontWeight: 700, py: 1,
                  '&:hover': { bgcolor: form.role === r ? '#aee019' : solostock.bg.tertiary },
                }}
              >
                {r === 'ACHETEUR' ? '🛒 Buyer' : '📦 Supplier'}
              </Button>
            ))}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '2px', bgcolor: alpha(solostock.accent.pink, 0.06), border: `1px solid ${alpha(solostock.accent.pink, 0.2)}`, color: solostock.accent.pink, '& .MuiAlert-icon': { color: solostock.accent.pink } }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5, mb: 2.5 }}>
              <Box sx={{ gridColumn: '1 / -1' }}>
                <TextField fullWidth label="Full Name" value={form.fullName} onChange={handleChange('fullName')} required sx={fieldSx}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlinedIcon sx={{ color: solostock.text.muted, fontSize: 20 }} /></InputAdornment> }} />
              </Box>
              <Box sx={{ gridColumn: '1 / -1' }}>
                <TextField fullWidth label="Email address" type="email" value={form.email} onChange={handleChange('email')} required autoComplete="email" sx={fieldSx}
                  InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ color: solostock.text.muted, fontSize: 20 }} /></InputAdornment> }} />
              </Box>
              <Box sx={{ gridColumn: '1 / -1' }}>
                <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange('password')} required sx={fieldSx}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: solostock.text.muted, fontSize: 20 }} /></InputAdornment>,
                    endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">{showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}</IconButton></InputAdornment>,
                  }} />
              </Box>
              <TextField fullWidth label="Company" value={form.company} onChange={handleChange('company')} required sx={fieldSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><BusinessOutlinedIcon sx={{ color: solostock.text.muted, fontSize: 20 }} /></InputAdornment> }} />
              <TextField fullWidth label="Phone" value={form.phone} onChange={handleChange('phone')} sx={fieldSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><PhoneOutlinedIcon sx={{ color: solostock.text.muted, fontSize: 20 }} /></InputAdornment> }} />
              <Box sx={{ gridColumn: '1 / -1' }}>
                <TextField fullWidth select label="I am a…" value={form.role} onChange={handleChange('role')} required sx={fieldSx}>
                  <MenuItem value="ACHETEUR">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <ShoppingCartOutlinedIcon sx={{ fontSize: 18, color: LIME }} />
                      <Box>
                        <Typography variant="body2" fontWeight={600}>Acheteur (Buyer)</Typography>
                        <Typography variant="caption" sx={{ color: solostock.text.muted }}>Browse and purchase wholesale products</Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                  <MenuItem value="FOURNISSEUR">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <LocalShippingOutlinedIcon sx={{ fontSize: 18, color: CYAN }} />
                      <Box>
                        <Typography variant="body2" fontWeight={600}>Fournisseur (Supplier)</Typography>
                        <Typography variant="caption" sx={{ color: solostock.text.muted }}>List products and manage wholesale orders</Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                </TextField>
              </Box>
            </Box>

            <Button
              type="submit" fullWidth variant="contained" size="large"
              disabled={loading}
              endIcon={!loading && <ArrowForwardIcon />}
              sx={{
                py: 1.6, fontSize: '1rem', fontWeight: 700,
                bgcolor: roleColor, color: '#000',
                '&:hover': { filter: 'brightness(0.9)', transform: 'translateY(-1px)', boxShadow: `0 8px 24px ${alpha(roleColor, 0.35)}` },
                '&:disabled': { bgcolor: alpha(roleColor, 0.4), color: 'rgba(0,0,0,0.4)' },
                transition: 'all 0.2s',
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: '#000' }} /> : 'Create Free Account'}
            </Button>
          </Box>

          <Typography sx={{ textAlign: 'center', mt: 4, color: solostock.text.secondary, fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <RouterLink to="/login" style={{ color: LIME, fontWeight: 700, textDecoration: 'none' }}>Sign in →</RouterLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;