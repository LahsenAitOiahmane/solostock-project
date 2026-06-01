import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, Container, Grid, Chip, alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { solostock } from '../theme';

/* ─────────────── Animated Counter ─────────────── */
const Counter = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800;
        const step = Math.ceil(end / (duration / 16));
        let cur = 0;
        const timer = setInterval(() => {
          cur = Math.min(cur + step, end);
          setCount(cur);
          if (cur >= end) clearInterval(timer);
        }, 16);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─────────────── Section Wrapper ──────────────── */
const Section = ({ children, id, bg = 'transparent', py = 10 }: any) => (
  <Box component="section" id={id} sx={{ py, position: 'relative', bgcolor: bg, overflow: 'hidden' }}>
    {children}
  </Box>
);

/* ─────────────── Feature Card ─────────────────── */
const FeatureCard = ({ icon, title, desc, color, delay }: any) => (
  <Box
    className={`card-hover animate-fade-in-up animate-delay-${delay}`}
    sx={{
      p: 4,
      height: '100%',
      bgcolor: solostock.bg.secondary,
      border: `1px solid ${solostock.border.default}`,
      borderRadius: '2px',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(135deg, ${alpha(color, 0.06)} 0%, transparent 60%)`,
        pointerEvents: 'none',
      },
      '&:hover': {
        borderColor: color,
        boxShadow: `0 8px 32px ${alpha(color, 0.15)}`,
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
      <Box sx={{ width: 52, height: 52, borderRadius: '2px', bgcolor: alpha(color, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {React.cloneElement(icon, { sx: { fontSize: 28, color } })}
      </Box>
      <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: solostock.text.primary, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
        {title}
      </Typography>
    </Box>
    <Typography sx={{ color: solostock.text.secondary, lineHeight: 1.7, fontSize: '0.95rem' }}>
      {desc}
    </Typography>
  </Box>
);

/* ─────────────── Step Card ─────────────────────── */
const StepCard = ({ num, title, desc, color, delay }: any) => (
  <Box className={`animate-fade-in-up animate-delay-${delay}`} sx={{ textAlign: 'center', px: 2 }}>
    <Box
      sx={{
        width: 64, height: 64, borderRadius: '50%',
        bgcolor: alpha(color, 0.12),
        border: `2px solid ${alpha(color, 0.4)}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        mx: 'auto', mb: 3,
        fontSize: '1.5rem', fontWeight: 800,
        color, fontFamily: '"Plus Jakarta Sans", sans-serif',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: -4,
          borderRadius: '50%',
          border: `1px dashed ${alpha(color, 0.25)}`,
          animation: 'spin-slow 12s linear infinite',
        },
      }}
    >
      {num}
    </Box>
    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: solostock.text.primary, mb: 1.5, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      {title}
    </Typography>
    <Typography sx={{ color: solostock.text.secondary, fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 220, mx: 'auto' }}>
      {desc}
    </Typography>
  </Box>
);

/* ─────────────── Main Component ────────────────── */
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const LIME = solostock.accent.blue; // #c1f11d
  const GREEN = solostock.accent.green;
  const CYAN = solostock.accent.cyan;
  const ORANGE = solostock.accent.orange;
  const PINK = solostock.accent.pink;

  const faqs = [
    { q: 'Who is Solostock for?', a: 'Solostock is built for B2B businesses — wholesale buyers sourcing products in bulk, and suppliers who want to expand their reach and manage orders digitally.' },
    { q: 'How does the negotiation system work?', a: 'Buyers submit offers on listed products. Suppliers can accept, reject, or send a counter-offer. Once both parties agree, the buyer can proceed to payment directly in the platform.' },
    { q: 'Is it free to join?', a: 'Yes! Registering as a buyer or supplier is completely free. You can browse the full catalog and start negotiations immediately after signing up.' },
    { q: 'How are payments handled?', a: 'Payments are processed securely through our integrated payment gateway. Buyers pay after an offer is accepted, and funds are transferred to suppliers upon confirmation.' },
    { q: 'Can I manage my product listings?', a: 'Suppliers have a full product management dashboard where they can add, edit, update stock levels, and monitor offer activity for each listing.' },
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── Ambient Background Blobs ── */}
      <Box sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <Box className="hero-blob" sx={{ position: 'absolute', top: '-15%', left: '-10%', width: 600, height: 600, bgcolor: alpha(LIME, 0.08), filter: 'blur(80px)' }} />
        <Box className="hero-blob" sx={{ position: 'absolute', top: '20%', right: '-15%', width: 500, height: 500, bgcolor: alpha(CYAN, 0.07), filter: 'blur(100px)', animationDelay: '2s' }} />
        <Box className="hero-blob" sx={{ position: 'absolute', bottom: '10%', left: '20%', width: 400, height: 400, bgcolor: alpha(GREEN, 0.06), filter: 'blur(90px)', animationDelay: '4s' }} />
      </Box>

      {/* ── Sticky Navigation ── */}
      <Box
        className="nav-blur"
        sx={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          borderBottom: `1px solid ${scrolled ? solostock.border.default : 'transparent'}`,
          bgcolor: scrolled ? alpha('#FAFAFA', 0.85) : 'transparent',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 38, height: 38, borderRadius: '2px', bgcolor: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <StorefrontOutlinedIcon sx={{ color: '#000', fontSize: 22 }} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: solostock.text.primary, fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.02em' }}>
                Solostock
              </Typography>
            </Box>

            {/* Nav Links */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
              {['Features', 'How it Works', 'Stats', 'FAQ'].map(l => (
                <Typography
                  key={l}
                  component="a"
                  href={`#${l.toLowerCase().replace(/ /g, '-')}`}
                  sx={{ color: solostock.text.secondary, fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', cursor: 'pointer', '&:hover': { color: solostock.text.primary }, transition: 'color 0.2s' }}
                >
                  {l}
                </Typography>
              ))}
            </Box>

            {/* CTA */}
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Button variant="outlined" size="small" onClick={() => navigate('/login')}
                sx={{ borderColor: solostock.border.strong, color: solostock.text.primary, '&:hover': { borderColor: LIME, bgcolor: alpha(LIME, 0.06) } }}>
                Log In
              </Button>
              <Button variant="contained" size="small" onClick={() => navigate('/register')}
                sx={{ bgcolor: LIME, color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#aee019' } }}>
                Get Started Free
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ═══════════════ HERO ═══════════════ */}
      <Box sx={{ pt: { xs: 14, md: 18 }, pb: { xs: 10, md: 14 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            {/* Badge */}
            <Chip
              label="🇲🇦 Morocco's #1 B2B Wholesale Platform"
              size="small"
              className="animate-bounce-in"
              sx={{ mb: 4, bgcolor: alpha(LIME, 0.15), color: solostock.text.primary, fontWeight: 600, border: `1px solid ${alpha(LIME, 0.4)}`, px: 1.5, height: 32, fontSize: '0.85rem' }}
            />

            {/* Headline */}
            <Typography
              variant="h1"
              className="animate-fade-in-up animate-delay-1"
              sx={{ fontSize: { xs: '2.6rem', sm: '3.8rem', md: '5.5rem' }, fontWeight: 800, lineHeight: 1.08, mb: 3, letterSpacing: '-0.03em', color: solostock.text.primary }}
            >
              Where Businesses{' '}
              <Box component="span" className="shimmer-text">Discover, Negotiate</Box>
              <br />& Close Deals.
            </Typography>

            {/* Sub-headline */}
            <Typography
              className="animate-fade-in-up animate-delay-2"
              sx={{ color: solostock.text.secondary, fontSize: { xs: '1.05rem', md: '1.25rem' }, maxWidth: 680, mx: 'auto', mb: 6, lineHeight: 1.7 }}
            >
              Solostock connects verified Moroccan suppliers with wholesale buyers on a single, powerful platform. Browse thousands of products, negotiate in real-time, and close deals — all without leaving your desk.
            </Typography>

            {/* CTA Buttons */}
            <Box className="animate-fade-in-up animate-delay-3" sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained" size="large"
                onClick={() => navigate('/register')}
                endIcon={<ArrowForwardIcon />}
                sx={{ bgcolor: LIME, color: '#000', fontWeight: 700, px: 4, py: 1.6, fontSize: '1rem', '&:hover': { bgcolor: '#aee019', transform: 'translateY(-2px)', boxShadow: `0 8px 24px ${alpha(LIME, 0.4)}` }, transition: 'all 0.2s' }}
              >
                Start for Free
              </Button>
              <Button
                variant="outlined" size="large"
                onClick={() => navigate('/login')}
                sx={{ borderColor: solostock.border.strong, color: solostock.text.primary, px: 4, py: 1.6, fontSize: '1rem', '&:hover': { borderColor: solostock.text.primary, bgcolor: solostock.bg.tertiary } }}
              >
                View Demo
              </Button>
            </Box>

            {/* Trust Badges */}
            <Box className="animate-fade-in-up animate-delay-4" sx={{ mt: 5, display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
              {['No credit card required', 'Free for buyers', 'Verified suppliers only'].map((text) => (
                <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <CheckIcon sx={{ fontSize: 16, color: GREEN }} />
                  <Typography sx={{ color: solostock.text.muted, fontSize: '0.85rem' }}>{text}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* ── Hero Visual ── */}
          <Box className="animate-fade-in-up animate-delay-5" sx={{ mt: 10, position: 'relative' }}>
            {/* Glow under card */}
            <Box sx={{ position: 'absolute', inset: '20px 40px -20px', bgcolor: alpha(LIME, 0.12), filter: 'blur(40px)', borderRadius: '2px', pointerEvents: 'none' }} />
            {/* Dashboard mockup */}
            <Box
              sx={{
                position: 'relative', bgcolor: solostock.bg.secondary,
                border: `1px solid ${solostock.border.default}`,
                borderRadius: '2px', overflow: 'hidden',
                boxShadow: `0 32px 80px rgba(0,0,0,0.10)`,
              }}
            >
              {/* Browser chrome */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2.5, py: 1.5, bgcolor: solostock.bg.tertiary, borderBottom: `1px solid ${solostock.border.default}` }}>
                {[PINK, ORANGE, GREEN].map((c, i) => (
                  <Box key={i} sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: c }} />
                ))}
                <Box sx={{ flex: 1, mx: 2, bgcolor: solostock.bg.secondary, borderRadius: '2px', border: `1px solid ${solostock.border.default}`, px: 2, py: 0.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: solostock.text.muted }}>app.solostock.ma/dashboard</Typography>
                </Box>
              </Box>
              {/* Stat bars mockup */}
              <Box sx={{ p: 3, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                {[
                  { label: 'Total Revenue', val: '284,500 MAD', color: LIME },
                  { label: 'Active Offers', val: '1,247', color: CYAN },
                  { label: 'Deals Closed', val: '389', color: GREEN },
                  { label: 'Active Users', val: '5,120', color: ORANGE },
                ].map(({ label, val, color }) => (
                  <Box key={label} sx={{ p: 2, bgcolor: solostock.bg.tertiary, borderRadius: '2px', border: `1px solid ${solostock.border.default}`, borderLeft: `3px solid ${color}` }}>
                    <Typography sx={{ fontSize: '0.7rem', color: solostock.text.muted, mb: 0.5, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>{label}</Typography>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: solostock.text.primary, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{val}</Typography>
                  </Box>
                ))}
              </Box>
              {/* Simulated chart bars */}
              <Box sx={{ px: 3, pb: 3, display: 'flex', alignItems: 'flex-end', gap: 1, height: 80 }}>
                {[40, 60, 45, 80, 55, 90, 70, 85, 65, 95, 75, 88].map((h, i) => (
                  <Box key={i} sx={{ flex: 1, height: `${h}%`, bgcolor: i === 11 ? LIME : alpha(LIME, 0.3 + (i * 0.05)), borderRadius: '2px 2px 0 0', transition: 'height 1s ease' }} />
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ═══════════════ STATS ═══════════════ */}
      <Section id="stats" bg={solostock.bg.secondary} py={8}>
        <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${alpha(LIME, 0.04)} 0%, transparent 60%)`, pointerEvents: 'none' }} />
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Grid container spacing={4}>
            {[
              { icon: <GroupsOutlinedIcon />, value: 5200, suffix: '+', label: 'Registered Users', color: LIME },
              { icon: <InventoryOutlinedIcon />, value: 12400, suffix: '+', label: 'Products Listed', color: CYAN },
              { icon: <HandshakeOutlinedIcon />, value: 3800, suffix: '+', label: 'Deals Closed', color: GREEN },
              { icon: <TrendingUpOutlinedIcon />, value: 98, suffix: '%', label: 'Satisfaction Rate', color: ORANGE },
            ].map(({ icon, value, suffix, label, color }, i) => (
              <Grid item xs={6} md={3} key={label}>
                <Box className={`animate-fade-in-up animate-delay-${i + 1}`} sx={{ textAlign: 'center' }}>
                  <Box sx={{ width: 56, height: 56, mx: 'auto', mb: 2, borderRadius: '2px', bgcolor: alpha(color, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {React.cloneElement(icon, { sx: { fontSize: 28, color } })}
                  </Box>
                  <Typography sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, fontWeight: 800, color: solostock.text.primary, fontFamily: '"Plus Jakarta Sans", sans-serif', lineHeight: 1 }}>
                    <Counter end={value} suffix={suffix} />
                  </Typography>
                  <Typography sx={{ color: solostock.text.muted, fontSize: '0.9rem', mt: 0.5 }}>{label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <Section id="features" py={10}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }} className="animate-fade-in-up">
            <Chip label="Platform Features" size="small" sx={{ mb: 2, bgcolor: alpha(CYAN, 0.12), color: CYAN, fontWeight: 600, border: `1px solid ${alpha(CYAN, 0.3)}` }} />
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 800, color: solostock.text.primary, mb: 2, letterSpacing: '-0.02em' }}>
              Everything you need to trade smarter
            </Typography>
            <Typography sx={{ color: solostock.text.secondary, maxWidth: 580, mx: 'auto', fontSize: '1.05rem', lineHeight: 1.7 }}>
              From discovery to payment, Solostock covers the entire B2B transaction lifecycle in one seamless experience.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              { icon: <LanguageOutlinedIcon />, title: 'Vast Product Catalog', desc: 'Browse thousands of products across all categories from verified Moroccan suppliers. Advanced filtering and search helps you find what you need in seconds.', color: LIME, delay: 1 },
              { icon: <SpeedOutlinedIcon />, title: 'Real-time Negotiations', desc: 'Submit offers, receive counter-offers, and close deals instantly. Our live negotiation system keeps every conversation transparent and fast.', color: CYAN, delay: 2 },
              { icon: <SecurityOutlinedIcon />, title: 'Secure Payments', desc: 'Pay with confidence through our integrated payment system. Every transaction is tracked, verified, and linked directly to your negotiated offer.', color: GREEN, delay: 3 },
              { icon: <VerifiedOutlinedIcon />, title: 'Verified Suppliers', desc: "Every supplier on Solostock goes through a verification process. Buy with confidence knowing you're dealing with legitimate, trusted businesses.", color: ORANGE, delay: 4 },
              { icon: <BarChartOutlinedIcon />, title: 'Analytics Dashboard', desc: 'Track your spending, monitor offer statuses, and visualize your business performance with rich analytics tailored to buyers and suppliers.', color: PINK, delay: 5 },
              { icon: <HandshakeOutlinedIcon />, title: 'Wholesale Pricing', desc: 'Access exclusive wholesale prices unavailable to the general public. The more you buy, the better the deals you can negotiate directly with suppliers.', color: CYAN, delay: 6 },
            ].map((f) => (
              <Grid item xs={12} sm={6} md={4} key={f.title}>
                <FeatureCard {...f} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <Section id="how-it-works" bg={solostock.bg.secondary} py={10}>
        <Box sx={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${alpha(LIME, 0.06)} 0%, transparent 60%)`, pointerEvents: 'none' }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }} className="animate-fade-in-up">
            <Chip label="How It Works" size="small" sx={{ mb: 2, bgcolor: alpha(GREEN, 0.12), color: GREEN, fontWeight: 600, border: `1px solid ${alpha(GREEN, 0.3)}` }} />
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 800, color: solostock.text.primary, letterSpacing: '-0.02em', mb: 2 }}>
              From signup to closed deal in 4 steps
            </Typography>
            <Typography sx={{ color: solostock.text.secondary, maxWidth: 520, mx: 'auto', fontSize: '1rem', lineHeight: 1.7 }}>
              Getting started on Solostock is fast and intuitive. Here's how the platform works.
            </Typography>
          </Box>

          {/* Steps */}
          <Grid container spacing={4} sx={{ position: 'relative' }}>
            {/* Connector line */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', top: 32, left: '12.5%', right: '12.5%', height: 2, background: `linear-gradient(90deg, ${LIME}, ${CYAN}, ${GREEN}, ${ORANGE})`, opacity: 0.25, borderRadius: 1, zIndex: 0 }} />
            {[
              { num: '1', title: 'Create Account', desc: 'Sign up in under 60 seconds as a buyer or supplier. No credit card required.', color: LIME },
              { num: '2', title: 'Browse Catalog', desc: 'Discover thousands of wholesale products from verified Moroccan suppliers.', color: CYAN },
              { num: '3', title: 'Submit Offer', desc: 'Found what you need? Send an offer and start a live negotiation thread.', color: GREEN },
              { num: '4', title: 'Pay & Close', desc: 'Accept the deal and pay securely. Everything is tracked in your dashboard.', color: ORANGE },
            ].map((step, i) => (
              <Grid item xs={6} md={3} key={step.num} sx={{ position: 'relative', zIndex: 1 }}>
                <StepCard {...step} delay={i + 1} />
              </Grid>
            ))}
          </Grid>

          {/* Role cards */}
          <Grid container spacing={3} sx={{ mt: 6 }}>
            {[
              {
                role: 'For Buyers',
                color: LIME,
                points: ['Access wholesale pricing', 'Negotiate directly with suppliers', 'Track all offers & payments', 'Instant delivery updates'],
                cta: 'Join as Buyer',
              },
              {
                role: 'For Suppliers',
                color: CYAN,
                points: ['List unlimited products', 'Receive and review offers', 'Manage your entire catalog', 'Get paid securely & on time'],
                cta: 'Become a Supplier',
              },
            ].map(({ role, color, points, cta }) => (
              <Grid item xs={12} md={6} key={role}>
                <Box
                  className="card-hover"
                  sx={{
                    p: 4, bgcolor: solostock.bg.default, borderRadius: '2px',
                    border: `1px solid ${solostock.border.default}`,
                    '&:hover': { borderColor: color, boxShadow: `0 8px 32px ${alpha(color, 0.15)}` },
                  }}
                >
                  <Chip label={role} size="small" sx={{ mb: 3, bgcolor: alpha(color, 0.12), color, fontWeight: 700, border: `1px solid ${alpha(color, 0.3)}` }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                    {points.map(p => (
                      <Box key={p} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: alpha(color, 0.15), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <CheckIcon sx={{ fontSize: 13, color }} />
                        </Box>
                        <Typography sx={{ color: solostock.text.secondary, fontSize: '0.95rem' }}>{p}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Button
                    variant="contained" fullWidth endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/register')}
                    sx={{ bgcolor: color, color: '#000', fontWeight: 700, '&:hover': { filter: 'brightness(0.9)', transform: 'translateY(-1px)', boxShadow: `0 6px 20px ${alpha(color, 0.35)}` }, transition: 'all 0.2s' }}
                  >
                    {cta}
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <Section id="testimonials" py={10}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 7 }} className="animate-fade-in-up">
            <Chip label="Testimonials" size="small" sx={{ mb: 2, bgcolor: alpha(ORANGE, 0.12), color: ORANGE, fontWeight: 600, border: `1px solid ${alpha(ORANGE, 0.3)}` }} />
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 800, color: solostock.text.primary, letterSpacing: '-0.02em' }}>
              Trusted by businesses across Morocco
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {[
              { name: 'Youssef B.', company: 'Mega Retailers Casablanca', quote: 'Solostock cut our supplier sourcing time by 60%. The negotiation system is a game changer — we close deals in hours, not weeks.', rating: 5, color: LIME },
              { name: 'Fatima Z.', company: 'Atlas Tech Supplies', quote: 'As a supplier, I went from managing emails and phone calls to a clean dashboard. My order volume tripled in the first 3 months.', rating: 5, color: CYAN },
              { name: 'Karim M.', company: 'BuildPro Morocco', quote: 'The platform is incredibly intuitive. Finding verified material suppliers at wholesale prices used to be a full-time job. Not anymore.', rating: 5, color: GREEN },
            ].map(({ name, company, quote, rating, color }) => (
              <Grid item xs={12} md={4} key={name}>
                <Box
                  className="card-hover animate-fade-in-up"
                  sx={{ p: 4, bgcolor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px', height: '100%', display: 'flex', flexDirection: 'column', gap: 2, '&:hover': { borderColor: color, boxShadow: `0 8px 32px ${alpha(color, 0.1)}` } }}
                >
                  {/* Stars */}
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {Array.from({ length: rating }).map((_, i) => (
                      <Box key={i} sx={{ color: ORANGE, fontSize: '1rem' }}>★</Box>
                    ))}
                  </Box>
                  <Typography sx={{ color: solostock.text.secondary, lineHeight: 1.7, fontSize: '0.95rem', flex: 1, fontStyle: 'italic' }}>
                    "{quote}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 1, borderTop: `1px solid ${solostock.border.default}` }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: alpha(color, 0.15), border: `2px solid ${alpha(color, 0.4)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color, fontSize: '0.9rem', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                      {name[0]}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: solostock.text.primary }}>{name}</Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: solostock.text.muted }}>{company}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <Section id="faq" bg={solostock.bg.secondary} py={10}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 7 }} className="animate-fade-in-up">
            <Chip label="FAQ" size="small" sx={{ mb: 2, bgcolor: alpha(PINK, 0.12), color: PINK, fontWeight: 600, border: `1px solid ${alpha(PINK, 0.3)}` }} />
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 800, color: solostock.text.primary, letterSpacing: '-0.02em' }}>
              Frequently asked questions
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {faqs.map((faq, i) => (
              <Box
                key={i}
                className="faq-item"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                sx={{ p: 3, border: `1px solid ${openFaq === i ? alpha(LIME, 0.4) : solostock.border.default}`, borderRadius: '2px', cursor: 'pointer', bgcolor: openFaq === i ? alpha(LIME, 0.04) : solostock.bg.secondary, transition: 'all 0.25s' }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ fontWeight: 700, color: solostock.text.primary, fontSize: '1rem' }}>{faq.q}</Typography>
                  <Box sx={{ width: 26, height: 26, borderRadius: '50%', bgcolor: openFaq === i ? LIME : solostock.bg.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.25s', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>
                    <Typography sx={{ fontSize: '1rem', lineHeight: 1, fontWeight: 700, color: openFaq === i ? '#000' : solostock.text.muted }}>+</Typography>
                  </Box>
                </Box>
                {openFaq === i && (
                  <Typography className="animate-fade-in" sx={{ mt: 2, color: solostock.text.secondary, lineHeight: 1.7, fontSize: '0.95rem' }}>
                    {faq.a}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Container>
      </Section>

      {/* ═══════════════ CTA BANNER ═══════════════ */}
      <Section py={10}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            className="animate-fade-in-up"
            sx={{
              p: { xs: 5, md: 8 }, textAlign: 'center', borderRadius: '2px',
              background: `linear-gradient(135deg, ${alpha(LIME, 0.12)} 0%, ${alpha(CYAN, 0.08)} 100%)`,
              border: `1px solid ${alpha(LIME, 0.3)}`,
              position: 'relative', overflow: 'hidden',
            }}
          >
            <Box className="hero-blob" sx={{ position: 'absolute', top: '-40%', right: '-20%', width: 300, height: 300, bgcolor: alpha(LIME, 0.15), filter: 'blur(60px)', pointerEvents: 'none' }} />
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 800, color: solostock.text.primary, mb: 2, letterSpacing: '-0.02em', position: 'relative' }}>
              Ready to grow your business?
            </Typography>
            <Typography sx={{ color: solostock.text.secondary, mb: 5, fontSize: '1.1rem', maxWidth: 480, mx: 'auto', lineHeight: 1.7, position: 'relative' }}>
              Join thousands of Moroccan businesses already trading smarter on Solostock.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', position: 'relative' }}>
              <Button
                variant="contained" size="large" endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/register')}
                sx={{ bgcolor: LIME, color: '#000', fontWeight: 700, px: 5, py: 1.8, fontSize: '1.05rem', '&:hover': { bgcolor: '#aee019', transform: 'translateY(-2px)', boxShadow: `0 10px 28px ${alpha(LIME, 0.45)}` }, transition: 'all 0.2s' }}
              >
                Create Free Account
              </Button>
              <Button
                variant="outlined" size="large"
                onClick={() => navigate('/login')}
                sx={{ borderColor: solostock.border.strong, color: solostock.text.primary, px: 5, py: 1.8, fontSize: '1.05rem', '&:hover': { borderColor: solostock.text.primary, bgcolor: alpha('#000', 0.04) } }}
              >
                Log In
              </Button>
            </Box>
          </Box>
        </Container>
      </Section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <Box component="footer" sx={{ borderTop: `1px solid ${solostock.border.default}`, py: 5, bgcolor: solostock.bg.secondary }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: '2px', bgcolor: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <StorefrontOutlinedIcon sx={{ color: '#000', fontSize: 18 }} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: solostock.text.primary, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Solostock</Typography>
              <Typography sx={{ color: solostock.text.muted, fontSize: '0.85rem' }}>— Morocco's B2B Wholesale Platform</Typography>
            </Box>
            <Typography sx={{ color: solostock.text.muted, fontSize: '0.82rem' }}>
              © {new Date().getFullYear()} Solostock. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>

    </Box>
  );
};

export default LandingPage;
