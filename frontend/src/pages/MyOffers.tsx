import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Chip, Skeleton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Typography, alpha, Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../components/ui/SnackbarProvider';
import negotiationService from '../services/negotiationService';
import paymentService from '../services/paymentService';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { solostock } from '../theme';

interface Offer { id: number; productName: string; proposedPrice: number; quantity: number; status: string; message: string; supplierId: number; }

const LIME = solostock.accent.blue;
const GREEN = solostock.accent.green;
const STATUS_COLOR: Record<string, string> = {
  PENDING: solostock.accent.orange,
  ACCEPTED: GREEN,
  REJECTED: solostock.accent.pink,
  COUNTER_OFFERED: solostock.accent.cyan,
  PAID: LIME,
};
const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Awaiting supplier response',
  ACCEPTED: 'Accepted — ready for payment',
  REJECTED: 'Rejected by supplier',
  COUNTER_OFFERED: 'Supplier sent a counter offer',
  PAID: 'Payment completed',
};
const METHODS = ['VIREMENT', 'CREDIT', 'TRAITE', 'CASH'];

const OfferCard = ({ offer, isPaid, actionLoading, onAccept, onReject, onPay }: any) => {
  const color = STATUS_COLOR[offer.status] || solostock.text.muted;
  const total = offer.proposedPrice * offer.quantity;

  return (
    <Box
      className="card-hover animate-fade-in-up"
      sx={{
        bgcolor: solostock.bg.secondary,
        border: `1px solid ${solostock.border.default}`,
        borderRadius: '2px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          borderColor: alpha(color, 0.4),
          boxShadow: `0 8px 32px ${alpha(color, 0.1)}`,
        },
      }}
    >
      {/* Status accent bar */}
      <Box sx={{ height: 3, background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.3)})` }} />

      <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '2px', bgcolor: alpha(color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShoppingBagOutlinedIcon sx={{ fontSize: 20, color }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: solostock.text.primary, lineHeight: 1.2, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                {offer.productName}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: solostock.text.muted }}>Offer #{offer.id.toString().padStart(4, '0')}</Typography>
            </Box>
          </Box>
          <Chip
            label={offer.status}
            size="small"
            sx={{ bgcolor: alpha(color, 0.1), color, border: `1px solid ${alpha(color, 0.3)}`, fontWeight: 700, fontSize: '0.65rem', height: 22 }}
          />
        </Box>

        {/* Financials */}
        <Box sx={{ p: 2, bgcolor: solostock.bg.tertiary, borderRadius: '2px', mb: 2.5, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: solostock.text.muted, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em', mb: 0.3 }}>Your Price</Typography>
            <Typography sx={{ fontWeight: 700, color: solostock.text.primary, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{offer.proposedPrice.toLocaleString()} MAD</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: solostock.text.muted, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em', mb: 0.3 }}>Qty</Typography>
            <Typography sx={{ fontWeight: 700, color: solostock.text.primary, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{offer.quantity} units</Typography>
          </Box>
        </Box>

        {/* Total */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: '0.82rem', color: solostock.text.muted }}>Total Value</Typography>
          <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: solostock.text.primary, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD
          </Typography>
        </Box>

        {/* Status message */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1.5, px: 2, bgcolor: alpha(color, 0.07), borderRadius: '2px', mb: 2.5, border: `1px solid ${alpha(color, 0.15)}` }}>
          <AccessTimeOutlinedIcon sx={{ fontSize: 14, color, flexShrink: 0 }} />
          <Typography sx={{ color, fontSize: '0.78rem', fontWeight: 500 }}>
            {STATUS_LABEL[offer.status] || offer.status}
          </Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ mt: 'auto' }}>
          {offer.status === 'COUNTER_OFFERED' && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                fullWidth variant="contained" size="small"
                disabled={actionLoading === offer.id}
                onClick={() => onAccept(offer.id)}
                sx={{ bgcolor: GREEN, color: '#000', fontWeight: 700, '&:hover': { filter: 'brightness(0.9)' } }}
              >
                {actionLoading === offer.id ? '…' : '✓ Accept'}
              </Button>
              <Button
                fullWidth variant="contained" size="small"
                disabled={actionLoading === offer.id}
                onClick={() => onReject(offer.id)}
                sx={{ bgcolor: alpha(solostock.accent.pink, 0.15), color: solostock.accent.pink, fontWeight: 700, border: `1px solid ${alpha(solostock.accent.pink, 0.3)}`, '&:hover': { bgcolor: alpha(solostock.accent.pink, 0.25) } }}
              >
                {actionLoading === offer.id ? '…' : '✕ Reject'}
              </Button>
            </Box>
          )}
          {offer.status === 'ACCEPTED' && !isPaid && (
            <Button
              fullWidth variant="contained"
              startIcon={<PaymentOutlinedIcon />}
              onClick={() => onPay(offer)}
              sx={{ bgcolor: LIME, color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#aee019', transform: 'translateY(-1px)', boxShadow: `0 6px 20px ${alpha(LIME, 0.3)}` }, transition: 'all 0.2s' }}
            >
              Pay Now — {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD
            </Button>
          )}
          {isPaid && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, py: 1.5, borderRadius: '2px', bgcolor: alpha(GREEN, 0.1), border: `1px solid ${alpha(GREEN, 0.25)}` }}>
              <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: GREEN }} />
              <Typography sx={{ color: GREEN, fontWeight: 700, fontSize: '0.9rem' }}>Payment Complete</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const MyOffers: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const userId = user?.id || 0;

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [payTarget, setPayTarget] = useState<Offer | null>(null);
  const [payMethod, setPayMethod] = useState('VIREMENT');
  const [paySubmitting, setPaySubmitting] = useState(false);
  const [paidOfferIds, setPaidOfferIds] = useState<Set<number>>(new Set());

  const loadOffers = () => {
    setLoading(true);
    const fetch = userId > 0 ? negotiationService.getOffersByBuyer(userId) : negotiationService.getAllOffers();
    fetch.then(data => { setOffers(data as Offer[]); setLoading(false); })
      .catch(() => { showSnackbar('Could not load offers', 'error'); setLoading(false); });
  };

  useEffect(() => { loadOffers(); }, []); // eslint-disable-line

  const acceptCounter = async (id: number) => {
    setActionLoading(id);
    try { await negotiationService.acceptOffer(id); showSnackbar('Counter offer accepted!', 'success'); loadOffers(); }
    catch { showSnackbar('Failed to accept counter offer', 'error'); }
    finally { setActionLoading(null); }
  };

  const rejectCounter = async (id: number) => {
    setActionLoading(id);
    try { await negotiationService.rejectOffer(id); showSnackbar('Offer rejected', 'info'); loadOffers(); }
    catch { showSnackbar('Failed to reject offer', 'error'); }
    finally { setActionLoading(null); }
  };

  const submitPayment = async () => {
    if (!payTarget) return;
    setPaySubmitting(true);
    try {
      await paymentService.submitPayment({ payerId: userId, receiverId: payTarget.supplierId, amount: payTarget.proposedPrice * payTarget.quantity, method: payMethod });
      showSnackbar('Payment successful!', 'success');
      setPaidOfferIds(prev => new Set(prev).add(payTarget.id));
      setPayTarget(null); loadOffers();
    } catch { showSnackbar('Payment failed. Please try again.', 'error'); }
    finally { setPaySubmitting(false); }
  };

  const statusCounts = offers.reduce((acc: Record<string, number>, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});

  return (
    <Box>
      <PageHeader title="My Offers" subtitle="Track your offer status and complete payments" actionLabel="New Offer" actionIcon={<AddIcon />} onAction={() => navigate('/catalog')} />

      {/* Status summary */}
      {!loading && offers.length > 0 && (
        <Box className="animate-fade-in-up" sx={{ display: 'flex', gap: 1.5, mb: 4, flexWrap: 'wrap' }}>
          {Object.entries(STATUS_COLOR).map(([status, color]) => {
            const count = statusCounts[status] || 0;
            if (!count) return null;
            return (
              <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1, bgcolor: alpha(color, 0.08), border: `1px solid ${alpha(color, 0.2)}`, borderRadius: '2px' }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color }}>{count}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: solostock.text.muted }}>{status}</Typography>
              </Box>
            );
          })}
        </Box>
      )}

      {loading && (
        <Grid container spacing={2.5}>
          {[1, 2, 3].map(i => (
            <Grid item xs={12} sm={6} lg={4} key={i}>
              <Box sx={{ bgcolor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px', overflow: 'hidden' }}>
                <Box sx={{ height: 3, bgcolor: solostock.bg.tertiary }} />
                <Box sx={{ p: 3 }}>
                  <Skeleton width="70%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" height={60} sx={{ borderRadius: '2px', mb: 2 }} />
                  <Skeleton variant="rectangular" height={48} sx={{ borderRadius: '2px' }} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && offers.length === 0 && (
        <EmptyState icon="📋" message="No offers yet" description="Browse the catalog to find products and make your first offer." ctaLabel="Browse Catalog" onCta={() => navigate('/catalog')} />
      )}

      <Grid container spacing={2.5}>
        {offers.map((offer, i) => (
          <Grid item xs={12} sm={6} lg={4} key={offer.id} className={`animate-delay-${Math.min(i + 1, 6)}`}>
            <OfferCard
              offer={offer}
              isPaid={offer.status === 'PAID' || paidOfferIds.has(offer.id)}
              actionLoading={actionLoading}
              onAccept={acceptCounter}
              onReject={rejectCounter}
              onPay={(o: Offer) => { setPayTarget(o); setPayMethod('VIREMENT'); }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Payment Dialog */}
      <Dialog
        open={!!payTarget} onClose={() => setPayTarget(null)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: '2px', border: `1px solid ${solostock.border.default}` } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Confirm Payment
        </DialogTitle>
        <DialogContent>
          {payTarget && (
            <Box sx={{ mb: 3, p: 2, bgcolor: solostock.bg.tertiary, borderRadius: '2px', border: `1px solid ${solostock.border.default}`, borderLeft: `3px solid ${LIME}` }}>
              <Typography sx={{ fontWeight: 600, color: solostock.text.primary, mb: 0.5 }}>{payTarget.productName}</Typography>
              <Typography sx={{ color: solostock.text.muted, fontSize: '0.8rem' }}>{payTarget.quantity} unit{payTarget.quantity !== 1 ? 's' : ''}</Typography>
            </Box>
          )}
          <Box sx={{ bgcolor: solostock.bg.tertiary, borderRadius: '2px', p: 2.5, mb: 3, textAlign: 'center', border: `1px solid ${solostock.border.default}` }}>
            <Typography sx={{ color: solostock.text.muted, fontSize: '0.78rem', mb: 0.5 }}>Total Amount</Typography>
            <Typography sx={{ color: solostock.text.primary, fontWeight: 800, fontSize: '1.8rem', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              {payTarget ? (payTarget.proposedPrice * payTarget.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
              <span style={{ fontSize: '1rem', fontWeight: 600 }}> MAD</span>
            </Typography>
          </Box>
          <TextField
            fullWidth select label="Payment Method" value={payMethod}
            onChange={e => setPayMethod(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '2px', '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: LIME } } }}
          >
            {METHODS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setPayTarget(null)} variant="outlined" sx={{ borderColor: solostock.border.default, color: solostock.text.secondary }}>Cancel</Button>
          <Button
            onClick={submitPayment} variant="contained" disabled={paySubmitting}
            startIcon={<PaymentOutlinedIcon />}
            sx={{ bgcolor: LIME, color: '#000', fontWeight: 700, flex: 1, '&:hover': { bgcolor: '#aee019' } }}
          >
            {paySubmitting ? 'Processing…' : 'Confirm Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyOffers;