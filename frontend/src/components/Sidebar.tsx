import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, Typography, Badge, Tooltip,
  IconButton, useMediaQuery, useTheme, alpha,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useAuth } from '../context/AuthContext';
import negotiationService from '../services/negotiationService';
import { solostock } from '../theme';

export const DRAWER_WIDTH = 256;
export const MINI_DRAWER_WIDTH = 72;

const LIME = solostock.accent.blue; // #c1f11d
const SIDEBAR_BG = '#0D0D0D';
const SIDEBAR_BORDER = 'rgba(255,255,255,0.07)';

interface NavItem { path: string; label: string; icon: React.ReactNode; badge?: number; }

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  ACHETEUR: [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardOutlinedIcon /> },
    { path: '/catalog', label: 'Catalog', icon: <InventoryOutlinedIcon /> },
    { path: '/my-offers', label: 'My Offers', icon: <HandshakeOutlinedIcon /> },
    { path: '/payments', label: 'Payments', icon: <PaymentOutlinedIcon /> },
  ],
  FOURNISSEUR: [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardOutlinedIcon /> },
    { path: '/my-products', label: 'My Products', icon: <InventoryOutlinedIcon /> },
    { path: '/received-offers', label: 'Received Offers', icon: <HandshakeOutlinedIcon /> },
    { path: '/payments', label: 'Earnings', icon: <TrendingUpOutlinedIcon /> },
  ],
  ADMIN: [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardOutlinedIcon /> },
    { path: '/catalog', label: 'All Products', icon: <InventoryOutlinedIcon /> },
    { path: '/admin', label: 'Admin Panel', icon: <AdminPanelSettingsOutlinedIcon /> },
  ],
};

const ROLE_BADGE: Record<string, { label: string; color: string }> = {
  ACHETEUR: { label: 'Buyer', color: LIME },
  FOURNISSEUR: { label: 'Supplier', color: solostock.accent.cyan },
  ADMIN: { label: 'Admin', color: solostock.accent.pink },
};

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
  desktopOpen: boolean;
  onDesktopToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose, desktopOpen, onDesktopToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const role: string = user?.role || 'ACHETEUR';
  const userId = user?.id || 0;
  const [pendingOffers, setPendingOffers] = useState(0);

  useEffect(() => {
    if (!userId || role !== 'FOURNISSEUR') return;
    negotiationService.getOffersBySupplier(userId)
      .then(data => {
        const count = data.filter(o => o.status === 'PENDING').length;
        setPendingOffers(count);
      })
      .catch(() => {});
  }, [userId, role]);

  const navItems: NavItem[] = (NAV_BY_ROLE[role] || NAV_BY_ROLE['ACHETEUR']).map(item => {
    if (item.path === '/received-offers' && pendingOffers > 0) return { ...item, badge: pendingOffers };
    return item;
  });

  const handleLogout = () => { logout(); navigate('/login'); };
  const handleNavigate = (path: string) => { navigate(path); if (isMobile) onMobileClose(); };

  const isExpanded = isMobile || desktopOpen;
  const roleBadge = ROLE_BADGE[role] || ROLE_BADGE['ACHETEUR'];
  const initials = user?.fullName?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  const drawerContent = (
    <Box sx={{
      display: 'flex', flexDirection: 'column', height: '100%',
      bgcolor: SIDEBAR_BG, overflowX: 'hidden',
      backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(193,241,29,0.04) 0%, transparent 60%)',
    }}>
      {/* ─── Logo ─── */}
      <Box sx={{
        px: isExpanded ? 3 : 0, py: 0,
        display: 'flex', alignItems: 'center', justifyContent: isExpanded ? 'space-between' : 'center',
        gap: 1.5, minHeight: 64, borderBottom: `1px solid ${SIDEBAR_BORDER}`,
        transition: 'all 0.3s ease',
        flexShrink: 0,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: '2px', bgcolor: LIME,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <StorefrontOutlinedIcon sx={{
              color: '#000', fontSize: 20,
              transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
              transform: desktopOpen ? 'rotate(0deg)' : 'rotate(-360deg)',
            }} />
          </Box>
          {isExpanded && (
            <Box sx={{ opacity: 1, transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1rem', fontFamily: '"Plus Jakarta Sans", sans-serif', lineHeight: 1.1 }}>
                Solostock
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', fontWeight: 500 }}>
                B2B Marketplace
              </Typography>
            </Box>
          )}
        </Box>
        {isMobile ? (
          <IconButton onClick={onMobileClose} size="small">
            <CloseIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }} />
          </IconButton>
        ) : isExpanded ? (
          <IconButton onClick={onDesktopToggle} size="small" sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: LIME } }}>
            <ChevronLeftIcon sx={{ fontSize: 20 }} />
          </IconButton>
        ) : null}
      </Box>

      {/* ─── User Profile Strip ─── */}
      {isExpanded && (
        <Box sx={{
          mx: 2, mt: 3, mb: 2, p: 2, borderRadius: '2px',
          bgcolor: 'rgba(255,255,255,0.04)',
          border: `1px solid ${SIDEBAR_BORDER}`,
          display: 'flex', alignItems: 'center', gap: 1.5,
        }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: '2px',
            bgcolor: alpha(LIME, 0.2), border: `1px solid ${alpha(LIME, 0.3)}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: '0.85rem', fontWeight: 800, color: LIME,
            fontFamily: '"Plus Jakarta Sans", sans-serif',
          }}>
            {initials}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.fullName || 'User'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, mt: 0.3 }}>
              <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: roleBadge.color }} />
              <Typography sx={{ color: roleBadge.color, fontSize: '0.7rem', fontWeight: 600 }}>
                {roleBadge.label}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {!isExpanded && (
        <Tooltip title={user?.fullName || 'User'} placement="right" arrow>
          <Box sx={{
            mx: 'auto', mt: 3, mb: 2,
            width: 40, height: 40, borderRadius: '2px',
            bgcolor: alpha(LIME, 0.2), border: `1px solid ${alpha(LIME, 0.3)}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem', fontWeight: 800, color: LIME,
            fontFamily: '"Plus Jakarta Sans", sans-serif', cursor: 'default',
          }}>
            {initials}
          </Box>
        </Tooltip>
      )}

      {/* ─── Section Label ─── */}
      {isExpanded && (
        <Typography sx={{ px: 3, mb: 1, color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Navigation
        </Typography>
      )}

      {/* ─── Nav Items ─── */}
      <List sx={{ px: isExpanded ? 1.5 : 1, flex: 1, pb: 0 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const btn = (
            <Box
              onClick={() => handleNavigate(item.path)}
              sx={{
                display: 'flex', alignItems: 'center',
                gap: isExpanded ? 1.5 : 0,
                justifyContent: isExpanded ? 'flex-start' : 'center',
                width: '100%', px: isExpanded ? 2 : 0, py: 1.3,
                borderRadius: '2px', mb: 0.5, cursor: 'pointer',
                position: 'relative', overflow: 'hidden',
                bgcolor: isActive ? alpha(LIME, 0.12) : 'transparent',
                border: `1px solid ${isActive ? alpha(LIME, 0.25) : 'transparent'}`,
                transition: 'all 0.18s ease',
                '&:hover': {
                  bgcolor: isActive ? alpha(LIME, 0.15) : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isActive ? alpha(LIME, 0.35) : 'rgba(255,255,255,0.08)'}`,
                },
                // Active left accent glow
                '&::before': isActive ? {
                  content: '""',
                  position: 'absolute', left: 0, top: '15%', bottom: '15%',
                  width: 3, borderRadius: '0 2px 2px 0',
                  bgcolor: LIME,
                  boxShadow: `0 0 8px ${LIME}`,
                } : {},
              }}
            >
              <Box sx={{
                color: isActive ? LIME : 'rgba(255,255,255,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: 20,
                transition: 'color 0.18s',
              }}>
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="warning"
                    sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 15, height: 15, borderRadius: '2px' } }}>
                    {item.icon}
                  </Badge>
                ) : item.icon}
              </Box>
              {isExpanded && (
                <Typography sx={{
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.18s',
                }}>
                  {item.label}
                </Typography>
              )}
              {isExpanded && item.badge ? (
                <Box sx={{ ml: 'auto', px: 1, py: 0.2, bgcolor: solostock.accent.orange, borderRadius: '2px', fontSize: '0.65rem', fontWeight: 700, color: '#000' }}>
                  {item.badge}
                </Box>
              ) : null}
            </Box>
          );

          return (
            <ListItem key={item.path} disablePadding>
              {isExpanded ? btn : (
                <Tooltip title={item.label} placement="right" arrow>
                  <Box sx={{ width: '100%' }}>{btn}</Box>
                </Tooltip>
              )}
            </ListItem>
          );
        })}
      </List>

      {/* ─── Bottom: Logout ─── */}
      <Box sx={{ px: isExpanded ? 1.5 : 1, pb: 3, borderTop: `1px solid ${SIDEBAR_BORDER}`, pt: 2 }}>
        {isExpanded ? (
          <Box
            onClick={handleLogout}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1.5,
              px: 2, py: 1.2, borderRadius: '2px', cursor: 'pointer',
              color: 'rgba(255,255,255,0.35)',
              border: '1px solid transparent',
              transition: 'all 0.18s',
              '&:hover': { bgcolor: alpha(solostock.accent.pink, 0.1), color: solostock.accent.pink, border: `1px solid ${alpha(solostock.accent.pink, 0.2)}` },
            }}
          >
            <LogoutOutlinedIcon sx={{ fontSize: 20 }} />
            <Typography sx={{ fontSize: '0.88rem', fontWeight: 500, color: 'inherit' }}>Log out</Typography>
          </Box>
        ) : (
          <Tooltip title="Log out" placement="right" arrow>
            <Box
              onClick={handleLogout}
              sx={{
                display: 'flex', justifyContent: 'center', px: 0, py: 1.2,
                borderRadius: '2px', cursor: 'pointer', color: 'rgba(255,255,255,0.3)',
                border: '1px solid transparent', transition: 'all 0.18s',
                '&:hover': { bgcolor: alpha(solostock.accent.pink, 0.1), color: solostock.accent.pink },
              }}
            >
              <LogoutOutlinedIcon sx={{ fontSize: 20 }} />
            </Box>
          </Tooltip>
        )}
      </Box>
    </Box>
  );

  const paperSx = {
    width: desktopOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
    boxSizing: 'border-box' as const,
    backgroundColor: SIDEBAR_BG,
    border: 'none',
    borderRight: `1px solid ${SIDEBAR_BORDER}`,
    overflowX: 'hidden' as const,
  };

  return (
    <>
      {/* Mobile */}
      {isMobile && (
        <Drawer
          variant="temporary" open={mobileOpen} onClose={onMobileClose}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { ...paperSx, width: DRAWER_WIDTH } }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Desktop */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: desktopOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
            transition: theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: 280 }),
            '& .MuiDrawer-paper': {
              ...paperSx,
              transition: theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: 280 }),
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;