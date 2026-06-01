import React, { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, useMediaQuery, useTheme, Avatar, Badge, alpha, InputBase } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Sidebar, { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from './Sidebar';
import AuroraBackground from './ui/AuroraBackground';
import { solostock } from '../theme';
import { useAuth } from '../context/AuthContext';

const LIME = solostock.accent.blue;

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  ACHETEUR: { label: 'Buyer', color: LIME, bg: `${LIME}1A` },
  FOURNISSEUR: { label: 'Supplier', color: solostock.accent.cyan, bg: `${solostock.accent.cyan}1A` },
  ADMIN: { label: 'Admin', color: solostock.accent.pink, bg: `${solostock.accent.pink}1A` },
};

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();

  const toggleSidebar = () => setDesktopOpen(!desktopOpen);
  const currentSidebarWidth = isMobile ? 0 : (desktopOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH);

  const role = user?.role || 'ACHETEUR';
  const roleConfig = ROLE_CONFIG[role] || ROLE_CONFIG['ACHETEUR'];
  const initials = user?.fullName?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';
  const firstName = user?.fullName?.split(' ')[0] || 'User';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        desktopOpen={desktopOpen}
        onDesktopToggle={toggleSidebar}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column',
          position: 'relative',
          width: { md: `calc(100% - ${currentSidebarWidth}px)` },
          transition: theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: 280 }),
        }}
      >
        {/* ─── Top App Bar ─── */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: solostock.bg.secondary,
            borderBottom: `1px solid ${solostock.border.default}`,
            zIndex: 10,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Toolbar sx={{ minHeight: '60px !important', px: { xs: 2, md: 3 }, gap: 2 }}>
            {/* Mobile menu toggle */}
            {isMobile && (
              <IconButton
                edge="start"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
                sx={{ color: solostock.text.primary, mr: 0.5 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Mobile logo */}
            {isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 30, height: 30, borderRadius: '2px', bgcolor: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <StorefrontOutlinedIcon sx={{ color: '#000', fontSize: 17 }} />
                </Box>
                <Typography sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, fontSize: '1rem', color: solostock.text.primary }}>
                  Solostock
                </Typography>
              </Box>
            )}

            {/* Page header portal (used by PageHeader component) */}
            <Box id="page-header-portal" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', overflow: 'hidden' }} />

            {/* ─── Right side ─── */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
              {/* Search (desktop) */}
              <Box
                sx={{
                  display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1,
                  px: 2, py: 0.8, borderRadius: '2px',
                  border: `1px solid ${solostock.border.default}`,
                  bgcolor: solostock.bg.tertiary,
                  '&:focus-within': { borderColor: LIME },
                  transition: 'border-color 0.2s',
                  width: 200,
                }}
              >
                <SearchIcon sx={{ fontSize: 16, color: solostock.text.muted }} />
                <InputBase
                  placeholder="Quick search…"
                  sx={{ fontSize: '0.85rem', color: solostock.text.secondary, '& input::placeholder': { color: solostock.text.muted }, flex: 1 }}
                />
                <Box sx={{ fontSize: '0.65rem', color: solostock.text.muted, px: 0.8, py: 0.3, bgcolor: solostock.bg.default, borderRadius: '2px', border: `1px solid ${solostock.border.subtle}`, whiteSpace: 'nowrap' }}>
                  ⌘ K
                </Box>
              </Box>

              {/* Notifications */}
              <Box sx={{ position: 'relative' }}>
                <IconButton
                  size="small"
                  sx={{
                    width: 36, height: 36, borderRadius: '2px',
                    color: solostock.text.secondary,
                    border: `1px solid ${solostock.border.default}`,
                    bgcolor: solostock.bg.tertiary,
                    '&:hover': { borderColor: LIME, color: LIME },
                    transition: 'all 0.2s',
                  }}
                >
                  <Badge
                    badgeContent={3}
                    sx={{
                      '& .MuiBadge-badge': {
                        bgcolor: solostock.accent.pink, color: '#fff',
                        height: 14, minWidth: 14, fontSize: '0.6rem', padding: '0 3px',
                        top: -2, right: -2,
                      }
                    }}
                  >
                    <NotificationsNoneOutlinedIcon sx={{ fontSize: 19 }} />
                  </Badge>
                </IconButton>
              </Box>

              {/* Divider */}
              <Box sx={{ width: 1, height: 28, bgcolor: solostock.border.default, display: { xs: 'none', sm: 'block' } }} />

              {/* User chip */}
              <Box
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer',
                  px: 1.5, py: 0.8, borderRadius: '2px',
                  border: `1px solid ${solostock.border.default}`,
                  bgcolor: solostock.bg.tertiary,
                  '&:hover': { borderColor: alpha(LIME, 0.4), bgcolor: solostock.bg.secondary },
                  transition: 'all 0.2s',
                }}
              >
                <Avatar
                  sx={{
                    width: 28, height: 28, borderRadius: '2px',
                    bgcolor: alpha(LIME, 0.2), border: `1px solid ${alpha(LIME, 0.3)}`,
                    color: LIME, fontSize: '0.72rem', fontWeight: 800,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                  }}
                >
                  {initials}
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: solostock.text.primary, lineHeight: 1.1 }}>
                    {firstName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: roleConfig.color }} />
                    <Typography sx={{ fontSize: '0.68rem', color: roleConfig.color, fontWeight: 600 }}>
                      {roleConfig.label}
                    </Typography>
                  </Box>
                </Box>
                <KeyboardArrowDownIcon sx={{ fontSize: 16, color: solostock.text.muted, display: { xs: 'none', sm: 'block' } }} />
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* ─── Page Content ─── */}
        <Box sx={{ flexGrow: 1, position: 'relative', bgcolor: solostock.bg.default }}>
          <AuroraBackground>
            <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
              {children}
            </Box>
          </AuroraBackground>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;