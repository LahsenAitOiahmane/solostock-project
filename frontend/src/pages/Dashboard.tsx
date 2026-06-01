import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Skeleton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, alpha, Button, Grid, IconButton,
} from '@mui/material';
import ChatDrawer from '../components/messaging/ChatDrawer';
import ChatIcon from '@mui/icons-material/Chat';
import { useAuth } from '../context/AuthContext';
import catalogService from '../services/catalogService';
import negotiationService from '../services/negotiationService';
import paymentService from '../services/paymentService';
import analyticsService from '../services/analyticsService';
import authService from '../services/authService';
import PageHeader from '../components/ui/PageHeader';
import { solostock } from '../theme';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';

import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar,
} from 'recharts';

const LIME = solostock.accent.blue;
const GREEN = solostock.accent.green;
const CYAN = solostock.accent.cyan;
const ORANGE = solostock.accent.orange;
const PINK = solostock.accent.pink;

const STATUS_COLOR: Record<string, string> = {
  PENDING: ORANGE,
  ACCEPTED: GREEN,
  REJECTED: PINK,
  COUNTER_OFFERED: CYAN,
  PAID: LIME,
};

// ─────────────────────────────────────────────
// KPI Card — big animated metric with sparkline
// ─────────────────────────────────────────────
const KPICard = ({
  icon, value, label, sublabel, color, trend, delay = 0,
}: {
  icon: React.ReactNode; value: string | number; label: string;
  sublabel?: string; color: string; trend?: string; delay?: number;
}) => (
  <Box
    className={`animate-fade-in-up animate-delay-${delay}`}
    sx={{
      bgcolor: solostock.bg.secondary,
      border: `1px solid ${solostock.border.default}`,
      borderRadius: '2px',
      p: 3,
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.2s',
      '&:hover': {
        borderColor: alpha(color, 0.4),
        boxShadow: `0 8px 32px ${alpha(color, 0.1)}`,
        transform: 'translateY(-1px)',
      },
      '&::before': {
        content: '""',
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.3)})`,
      },
    }}
  >
    {/* Icon */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
      <Box sx={{ width: 42, height: 42, borderRadius: '2px', bgcolor: alpha(color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {React.cloneElement(icon as React.ReactElement<any>, { sx: { fontSize: 22, color } })}
      </Box>
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.4, borderRadius: '2px', bgcolor: alpha(GREEN, 0.1), border: `1px solid ${alpha(GREEN, 0.2)}` }}>
          <TrendingUpOutlinedIcon sx={{ fontSize: 12, color: GREEN }} />
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: GREEN }}>{trend}</Typography>
        </Box>
      )}
    </Box>
    <Typography sx={{ fontWeight: 800, fontSize: '1.9rem', color: solostock.text.primary, fontFamily: '"Plus Jakarta Sans", sans-serif', lineHeight: 1, mb: 0.5, letterSpacing: '-0.02em' }}>
      {value}
    </Typography>
    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: solostock.text.secondary, mb: sublabel ? 0.4 : 0 }}>
      {label}
    </Typography>
    {sublabel && (
      <Typography sx={{ fontSize: '0.75rem', color: solostock.text.muted }}>
        {sublabel}
      </Typography>
    )}
  </Box>
);

// ─────────────────────────────────────────────
// Quick action button
// ─────────────────────────────────────────────
const QuickAction = ({ label, desc, color, onClick }: { label: string; desc: string; color: string; onClick: () => void }) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      p: 2, borderRadius: '2px', cursor: 'pointer',
      border: `1px solid ${solostock.border.default}`,
      bgcolor: solostock.bg.secondary,
      transition: 'all 0.2s',
      '&:hover': { borderColor: alpha(color, 0.4), bgcolor: solostock.bg.tertiary, transform: 'translateX(3px)' },
    }}
  >
    <Box>
      <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: solostock.text.primary }}>{label}</Typography>
      <Typography sx={{ fontSize: '0.75rem', color: solostock.text.muted }}>{desc}</Typography>
    </Box>
    <ArrowForwardIcon sx={{ color, fontSize: 18, flexShrink: 0 }} />
  </Box>
);

// ─────────────────────────────────────────────
// Offer status row
// ─────────────────────────────────────────────
interface Offer {
  id: number;
  productName: string;
  status: string;
  proposedPrice: number;
  quantity: number;
}

interface OfferRowProps {
  offer: Offer;
  handleOpenChat: (id: number) => void;
}

const OfferRow: React.FC<OfferRowProps> = ({ offer, handleOpenChat }) => {
  const color = STATUS_COLOR[offer.status] || solostock.text.muted;
  return (
    <TableRow hover sx={{ '&:hover': { bgcolor: solostock.bg.tertiary } }}>
      <TableCell>
        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: solostock.text.primary }}>{offer.productName}</Typography>
      </TableCell>
      <TableCell sx={{ color: solostock.text.secondary, fontSize: '0.84rem' }}>
        {(offer.proposedPrice * offer.quantity).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} MAD
      </TableCell>
      <TableCell>
        <Chip label={offer.status} size="small" sx={{ bgcolor: alpha(color, 0.1), color, border: `1px solid ${alpha(color, 0.25)}`, fontWeight: 700, fontSize: '0.65rem', height: 20 }} />
      </TableCell>
      <TableCell>
        <IconButton size="small" onClick={() => handleOpenChat(offer.id)} title="Message">
          <ChatIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

// ─────────────────────────────────────────────
// Chart panel wrapper
// ─────────────────────────────────────────────
const ChartCard = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ bgcolor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px', p: 3 }}>
    <Box sx={{ mb: 3 }}>
      <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: solostock.text.primary, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
        {title}
      </Typography>
      {subtitle && <Typography sx={{ fontSize: '0.78rem', color: solostock.text.muted, mt: 0.3 }}>{subtitle}</Typography>}
    </Box>
    {children}
  </Box>
);

// ─────────────────────────────────────────────
// Table heading cell
// ─────────────────────────────────────────────
const TH = ({ children }: { children: React.ReactNode }) => (
  <TableCell sx={{ bgcolor: solostock.bg.tertiary, color: solostock.text.muted, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5 }}>
    {children}
  </TableCell>
);

// ─────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────
interface AdminDashData {
  totalProducts: number; totalOffers: number; acceptedOffers: number;
  conversionRate: number; totalRevenue: number; topCategory: string; monthlyStats?: any[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id || 0;
  const role = user?.role || 'ACHETEUR';
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);

  const handleOpenChat = (id: number) => {
    setSelectedOfferId(id);
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedOfferId(null);
  };

  const [adminData, setAdminData] = useState<AdminDashData | null>(null);
  const [myOffers, setMyOffers] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [productsAvailable, setProductsAvailable] = useState(0);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [receivedOffers, setReceivedOffers] = useState<any[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    if (role === 'ADMIN') {
      Promise.all([
        analyticsService.getDashboardStats(),
        authService.getUsers()
      ])
        .then(([data, users]) => { 
          setAdminData(data as any); 
          setRecentUsers(users as any[]);
          setLoading(false); 
        })
        .catch(() => { setError('Could not load dashboard'); setLoading(false); });
    } else if (role === 'ACHETEUR') {
      Promise.all([
        userId > 0 ? negotiationService.getOffersByBuyer(userId) : negotiationService.getAllOffers(),
        userId > 0 ? paymentService.getTransactionsByPayer(userId) : Promise.resolve([]),
        catalogService.getProducts(),
      ]).then(([offers, payments, products]) => {
        setMyOffers((offers as any[]).sort((a, b) => b.id - a.id));
        setTotalSpent((payments as any[]).reduce((sum, p: any) => sum + (p.amount || 0), 0));
        setProductsAvailable(products.length);
        setLoading(false);
      }).catch(() => { setError('Could not load dashboard'); setLoading(false); });
    } else if (role === 'FOURNISSEUR') {
      Promise.all([
        userId > 0 ? negotiationService.getOffersBySupplier(userId) : negotiationService.getAllOffers(),
        paymentService.getAllTransactions(),
        userId > 0 ? catalogService.getProductsBySupplier(userId) : catalogService.getProducts(),
      ]).then(([offers, payments, products]) => {
        setReceivedOffers((offers as any[]).sort((a, b) => b.id - a.id));
        const mine = userId > 0 ? (payments as any[]).filter((p: any) => p.receiverId === userId) : payments;
        setTotalEarned((mine as any[]).reduce((sum, p: any) => sum + (p.amount || 0), 0));
        setMyProducts(products);
        setLoading(false);
      }).catch(() => { setError('Could not load dashboard'); setLoading(false); });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, userId]);

  const firstName = user?.fullName?.split(' ')[0] || user?.email || 'there';
  const acceptedOffers = myOffers.filter((o: any) => o.status === 'ACCEPTED' || o.status === 'PAID').length;
  const pendingOffers = receivedOffers.filter((o: any) => o.status === 'PENDING').length;

  // Pie data
  const buildPieData = (offers: any[]) => {
    const counts = offers.reduce((acc: any, o: any) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});
    const arr = Object.keys(counts).map(k => ({ name: k, value: counts[k] })).filter(d => d.value > 0);
    return arr.length ? arr : [{ name: 'NO DATA', value: 1 }];
  };

  // Monthly revenue mock
  const monthlyData = adminData?.monthlyStats?.length ? adminData.monthlyStats : [
    { month: 'Jan', revenue: 12000, offers: 34 },
    { month: 'Feb', revenue: 19000, offers: 52 },
    { month: 'Mar', revenue: 15000, offers: 41 },
    { month: 'Apr', revenue: 25000, offers: 68 },
    { month: 'May', revenue: 31000, offers: 82 },
    { month: 'Jun', revenue: 28000, offers: 74 },
  ];

  const barData = (role === 'ACHETEUR' ? myOffers : receivedOffers).slice(0, 6).map((o: any) => ({
    name: `#${o.id}`,
    amount: Math.round(o.proposedPrice * o.quantity),
  }));
  if (barData.length === 0) barData.push({ name: 'None', amount: 0 });

  const pieData = buildPieData(role === 'ACHETEUR' ? myOffers : receivedOffers);

  if (loading) {
    return (
      <Box>
        <PageHeader title="Dashboard" subtitle="Loading…" />
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map(i => <Grid item xs={12} sm={6} lg={3} key={i}><Skeleton variant="rectangular" height={120} sx={{ borderRadius: '2px' }} /></Grid>)}
        </Grid>
        <Grid container spacing={2.5}>
          {[1, 2].map(i => <Grid item xs={12} lg={6} key={i}><Skeleton variant="rectangular" height={280} sx={{ borderRadius: '2px' }} /></Grid>)}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* ─── Hero greeting ─── */}
      <Box className="animate-fade-in" sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: LIME, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.5 }}>
              {role === 'ADMIN' ? 'Platform Overview' : role === 'FOURNISSEUR' ? 'Supplier Dashboard' : 'Buyer Dashboard'}
            </Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, fontWeight: 800, color: solostock.text.primary, fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Good day, {firstName} 👋
            </Typography>
            <Typography sx={{ color: solostock.text.muted, fontSize: '0.9rem', mt: 0.8 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>
          {role !== 'ADMIN' && (
            <Button
              variant="contained"
              size="small"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate(role === 'ACHETEUR' ? '/catalog' : '/my-products')}
              sx={{ bgcolor: LIME, color: '#000', fontWeight: 700, borderRadius: '2px', '&:hover': { bgcolor: '#aee019', transform: 'translateY(-1px)' }, transition: 'all 0.2s' }}
            >
              {role === 'ACHETEUR' ? 'Browse Catalog' : 'Manage Products'}
            </Button>
          )}
        </Box>
      </Box>

      {error && (
        <Box sx={{ bgcolor: alpha(PINK, 0.06), borderRadius: '2px', p: 2, mb: 3, color: PINK, border: `1px solid ${alpha(PINK, 0.2)}`, fontSize: '0.875rem' }}>
          ⚠️ {error}
        </Box>
      )}

      {/* ─── ACHETEUR (Buyer) ─── */}
      {role === 'ACHETEUR' && (
        <>
          {/* KPI Cards */}
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <KPICard icon={<HandshakeOutlinedIcon />} value={myOffers.length} label="Total Offers" sublabel="All negotiations started" color={LIME} trend="+12%" delay={1} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <KPICard icon={<TrendingUpOutlinedIcon />} value={acceptedOffers} label="Accepted Deals" sublabel="Ready for payment" color={GREEN} delay={2} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <KPICard icon={<InventoryOutlinedIcon />} value={productsAvailable} label="Available Products" sublabel="Across all categories" color={CYAN} delay={3} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <KPICard icon={<AccountBalanceWalletOutlinedIcon />} value={`${totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })} MAD`} label="Total Spent" sublabel="Completed transactions" color={ORANGE} delay={4} />
            </Grid>
          </Grid>

          {/* Charts row */}
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} lg={7} className="animate-fade-in-up animate-delay-3">
              <ChartCard title="Offer Volume" subtitle="Value of each negotiation (MAD)">
                <Box sx={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={solostock.border.subtle} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: solostock.text.muted }} dy={8} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: solostock.text.muted }} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
                      <RechartsTooltip
                        cursor={{ fill: alpha(LIME, 0.05) }}
                        contentStyle={{ backgroundColor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px', boxShadow: 'none', fontSize: '0.8rem' }}
                        formatter={(val: number) => [`${val.toLocaleString()} MAD`, 'Amount']}
                      />
                      <Bar dataKey="amount" fill={LIME} radius={[3, 3, 0, 0]} maxBarSize={48} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </ChartCard>
            </Grid>
            <Grid item xs={12} lg={5} className="animate-fade-in-up animate-delay-4">
              <ChartCard title="Offers by Status" subtitle="Distribution of all negotiations">
                <Box sx={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLOR[entry.name] || solostock.border.strong} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px', boxShadow: 'none', fontSize: '0.8rem' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, justifyContent: 'center' }}>
                  {pieData.map(d => (
                    <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: STATUS_COLOR[d.name] || solostock.border.strong, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: '0.72rem', color: solostock.text.muted }}>{d.name} ({d.value})</Typography>
                    </Box>
                  ))}
                </Box>
              </ChartCard>
            </Grid>
          </Grid>

          {/* Bottom row */}
          <Grid container spacing={2.5} className="animate-fade-in-up animate-delay-5">
            <Grid item xs={12} lg={8}>
              <Box sx={{ bgcolor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px', overflow: 'hidden' }}>
                <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${solostock.border.default}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Recent Offers</Typography>
                  <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/my-offers')} sx={{ color: LIME, fontSize: '0.8rem', fontWeight: 600 }}>View All</Button>
                </Box>
                <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TH>Product</TH>
                        <TH>Amount</TH>
                        <TH>Status</TH>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {myOffers.slice(0, 6).map((offer: any) => <OfferRow key={offer.id} offer={offer} handleOpenChat={handleOpenChat} />)}
                      {myOffers.length === 0 && (
                        <TableRow><TableCell colSpan={3} sx={{ textAlign: 'center', py: 4, color: solostock.text.muted }}>No offers yet — browse the catalog to get started.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Box sx={{ bgcolor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px', p: 3 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 2, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Quick Actions</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <QuickAction label="Browse Catalog" desc="Find products to negotiate" color={LIME} onClick={() => navigate('/catalog')} />
                  <QuickAction label="My Offers" desc="Track all your negotiations" color={CYAN} onClick={() => navigate('/my-offers')} />
                  <QuickAction label="Payment History" desc="View completed transactions" color={ORANGE} onClick={() => navigate('/payments')} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </>
      )}

      {/* ─── FOURNISSEUR (Supplier) ─── */}
      {role === 'FOURNISSEUR' && (
        <>
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <KPICard icon={<HandshakeOutlinedIcon />} value={receivedOffers.length} label="Received Offers" sublabel="Total buyer negotiations" color={LIME} trend="+8%" delay={1} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <KPICard icon={<TrendingUpOutlinedIcon />} value={pendingOffers} label="Pending Actions" sublabel="Awaiting your response" color={ORANGE} delay={2} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <KPICard icon={<InventoryOutlinedIcon />} value={myProducts.length} label="My Listings" sublabel="Active catalog products" color={CYAN} delay={3} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <KPICard icon={<AccountBalanceWalletOutlinedIcon />} value={`${totalEarned.toLocaleString(undefined, { maximumFractionDigits: 0 })} MAD`} label="Total Earned" sublabel="Completed payments received" color={GREEN} delay={4} />
            </Grid>
          </Grid>

          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} lg={7} className="animate-fade-in-up animate-delay-3">
              <ChartCard title="Offer Values" subtitle="Revenue per offer negotiation (MAD)">
                <Box sx={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={solostock.border.subtle} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: solostock.text.muted }} dy={8} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: solostock.text.muted }} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
                      <RechartsTooltip cursor={{ fill: alpha(GREEN, 0.05) }} contentStyle={{ backgroundColor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px', boxShadow: 'none', fontSize: '0.8rem' }} formatter={(val: number) => [`${val.toLocaleString()} MAD`, 'Value']} />
                      <Bar dataKey="amount" fill={GREEN} radius={[3, 3, 0, 0]} maxBarSize={48} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </ChartCard>
            </Grid>
            <Grid item xs={12} lg={5} className="animate-fade-in-up animate-delay-4">
              <ChartCard title="Offer Status Mix" subtitle="Breakdown of all incoming offers">
                <Box sx={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLOR[entry.name] || solostock.border.strong} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px', boxShadow: 'none', fontSize: '0.8rem' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, justifyContent: 'center' }}>
                  {pieData.map(d => (
                    <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: STATUS_COLOR[d.name] || solostock.border.strong, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: '0.72rem', color: solostock.text.muted }}>{d.name} ({d.value})</Typography>
                    </Box>
                  ))}
                </Box>
              </ChartCard>
            </Grid>
          </Grid>

          <Grid container spacing={2.5} className="animate-fade-in-up animate-delay-5">
            <Grid item xs={12} lg={8}>
              <Box sx={{ bgcolor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px', overflow: 'hidden' }}>
                <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${solostock.border.default}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Incoming Offers</Typography>
                  <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/received-offers')} sx={{ color: LIME, fontSize: '0.8rem', fontWeight: 600 }}>View All</Button>
                </Box>
                <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TH>Product</TH>
                        <TH>Amount</TH>
                        <TH>Status</TH>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {receivedOffers.slice(0, 6).map((offer: any) => <OfferRow key={offer.id} offer={offer} handleOpenChat={handleOpenChat} />)}
                      {receivedOffers.length === 0 && (
                        <TableRow><TableCell colSpan={3} sx={{ textAlign: 'center', py: 4, color: solostock.text.muted }}>No offers received yet. Add products to the catalog to attract buyers.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Box sx={{ bgcolor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px', p: 3 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 2, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Quick Actions</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <QuickAction label="Manage Products" desc="Add or edit your listings" color={LIME} onClick={() => navigate('/my-products')} />
                  <QuickAction label="Review Offers" desc="Respond to pending negotiations" color={ORANGE} onClick={() => navigate('/received-offers')} />
                  <QuickAction label="Earnings" desc="View all payments received" color={GREEN} onClick={() => navigate('/payments')} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </>
      )}

      {/* ─── ADMIN ─── */}
      {role === 'ADMIN' && adminData && (
        <>
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} lg={2}><KPICard icon={<InventoryOutlinedIcon />} value={adminData.totalProducts} label="Products" sublabel="Platform-wide" color={LIME} delay={1} /></Grid>
            <Grid item xs={12} sm={6} lg={2}><KPICard icon={<HandshakeOutlinedIcon />} value={adminData.totalOffers} label="Total Offers" sublabel="All negotiations" color={CYAN} trend="+11%" delay={2} /></Grid>
            <Grid item xs={12} sm={6} lg={2}><KPICard icon={<TrendingUpOutlinedIcon />} value={adminData.acceptedOffers} label="Closed Deals" sublabel="Accepted offers" color={GREEN} delay={3} /></Grid>
            <Grid item xs={12} sm={6} lg={2}><KPICard icon={<AccountBalanceWalletOutlinedIcon />} value={`${(adminData.totalRevenue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} MAD`} label="Revenue" sublabel="Completed transactions" color={ORANGE} delay={4} /></Grid>
            <Grid item xs={12} sm={6} lg={2}><KPICard icon={<PeopleOutlinedIcon />} value="42" label="Active Users" sublabel="On platform today" color={PINK} trend="+5" delay={5} /></Grid>
            <Grid item xs={12} sm={6} lg={2}><KPICard icon={<ShowChartOutlinedIcon />} value="+14.2%" label="MoM Growth" sublabel="vs last month" color={GREEN} delay={6} /></Grid>
          </Grid>

          {/* Area + Bar charts */}
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} lg={8} className="animate-fade-in-up animate-delay-3">
              <ChartCard title="Platform Revenue" subtitle="Monthly transaction volume (MAD)">
                <Box sx={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={LIME} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={LIME} stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={solostock.border.subtle} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: solostock.text.muted }} dy={8} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: solostock.text.muted }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                      <RechartsTooltip contentStyle={{ backgroundColor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px', boxShadow: 'none', fontSize: '0.8rem' }} formatter={(val: number) => [`${val.toLocaleString()} MAD`, 'Revenue']} />
                      <Area type="monotone" dataKey="revenue" stroke={LIME} strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ fill: LIME, r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </ChartCard>
            </Grid>
            <Grid item xs={12} lg={4} className="animate-fade-in-up animate-delay-4">
              <ChartCard title="Monthly Offers" subtitle="Volume of negotiations per month">
                <Box sx={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={solostock.border.subtle} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: solostock.text.muted }} dy={8} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: solostock.text.muted }} />
                      <RechartsTooltip contentStyle={{ backgroundColor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px', boxShadow: 'none', fontSize: '0.8rem' }} />
                      <Bar dataKey="offers" fill={CYAN} radius={[3, 3, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </ChartCard>
            </Grid>
          </Grid>

          {/* Users table + quick action */}
          <Grid container spacing={2.5} className="animate-fade-in-up animate-delay-5">
            <Grid item xs={12} lg={8}>
              <Box sx={{ bgcolor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px', overflow: 'hidden' }}>
                <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${solostock.border.default}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Recent Platform Users</Typography>
                  <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/admin')} sx={{ color: LIME, fontSize: '0.8rem', fontWeight: 600 }}>Admin Panel</Button>
                </Box>
                <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TH>User</TH>
                        <TH>Role</TH>
                        <TH>Status</TH>
                        <TH>Actions</TH>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentUsers.slice(0, 5).map(u => {
                        const roleColor = u.role === 'FOURNISSEUR' ? CYAN : LIME;
                        const statusColor = u.active ? GREEN : PINK;
                        const statusStr = u.active ? 'ACTIVE' : 'SUSPENDED';
                        return (
                          <TableRow key={u.id} hover sx={{ '&:hover': { bgcolor: solostock.bg.tertiary } }}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ width: 28, height: 28, borderRadius: '2px', bgcolor: alpha(roleColor, 0.15), border: `1px solid ${alpha(roleColor, 0.25)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, color: roleColor, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                  {u.fullName ? u.fullName.charAt(0) : 'U'}
                                </Box>
                                <Box>
                                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: solostock.text.primary }}>{u.fullName}</Typography>
                                  <Typography sx={{ fontSize: '0.7rem', color: solostock.text.muted }}>#{u.id}</Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip label={u.role === 'FOURNISSEUR' ? 'Supplier' : 'Buyer'} size="small" sx={{ bgcolor: alpha(roleColor, 0.1), color: roleColor, fontWeight: 700, height: 20, fontSize: '0.65rem', border: `1px solid ${alpha(roleColor, 0.25)}` }} />
                            </TableCell>
                            <TableCell>
                              <Chip label={statusStr} size="small" sx={{ bgcolor: alpha(statusColor, 0.1), color: statusColor, border: `1px solid ${alpha(statusColor, 0.25)}`, fontSize: '0.65rem', fontWeight: 700, height: 20 }} />
                            </TableCell>
                            <TableCell>
                              <IconButton size="small" onClick={() => navigate('/admin')} sx={{ color: solostock.text.muted, '&:hover': { color: LIME } }}>
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Box sx={{ bgcolor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px', p: 3 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 2, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Admin Actions</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <QuickAction label="Admin Panel" desc="Manage users and platform" color={LIME} onClick={() => navigate('/admin')} />
                  <QuickAction label="All Products" desc="Review the full catalog" color={CYAN} onClick={() => navigate('/catalog')} />
                </Box>
                {/* Conversion rate ring */}
                <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${solostock.border.default}` }}>
                  <Typography sx={{ fontSize: '0.75rem', color: solostock.text.muted, mb: 1.5, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Conversion Rate</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ position: 'relative', width: 70, height: 70 }}>
                      <svg width="70" height="70" viewBox="0 0 70 70">
                        <circle cx="35" cy="35" r="28" fill="none" stroke={solostock.bg.tertiary} strokeWidth="6" />
                        <circle cx="35" cy="35" r="28" fill="none" stroke={LIME} strokeWidth="6"
                          strokeDasharray={`${(adminData.conversionRate || 0.42) * 175.9} 175.9`}
                          strokeLinecap="round" transform="rotate(-90 35 35)" />
                      </svg>
                      <Typography sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: LIME, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        {Math.round((adminData.conversionRate || 0.42) * 100)}%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: solostock.text.primary, fontSize: '0.9rem' }}>Offer → Deal</Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: solostock.text.muted }}>
                        {adminData.acceptedOffers} of {adminData.totalOffers} offers closed
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    <ChatDrawer offerId={selectedOfferId ?? 0} open={chatOpen} onClose={handleCloseChat} />
            </Box>
  );
};

export default Dashboard;