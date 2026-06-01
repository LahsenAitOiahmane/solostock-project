import React, { useEffect, useState } from 'react';
import { Box, Button, Chip, Skeleton, TextField, Typography, alpha } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../components/ui/SnackbarProvider';
import negotiationService from '../services/negotiationService';
import PageHeader from '../components/ui/PageHeader';
import GlassCard from '../components/ui/GlassCard';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { solostock } from '../theme';

interface Offer { id: number; productName: string; proposedPrice: number; quantity: number; status: string; message: string; buyerId: number; }
const STATUS_COLOR: Record<string, string> = { PENDING: solostock.accent.orange, ACCEPTED: solostock.accent.green, REJECTED: solostock.accent.pink, COUNTER_OFFERED: solostock.accent.cyan, PAID: solostock.accent.blue };

const ReceivedOffers: React.FC = () => {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const userId = user?.id || 0;

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [counterTarget, setCounterTarget] = useState<number | null>(null);
  const [counterPrice, setCounterPrice] = useState('');
  const [rejectTarget, setRejectTarget] = useState<Offer | null>(null);
  const [rejecting, setRejecting] = useState(false);

  const loadOffers = () => {
    setLoading(true);
    const fetch = userId > 0 ? negotiationService.getOffersBySupplier(userId) : negotiationService.getAllOffers();
    fetch.then(data => { setOffers(data as Offer[]); setLoading(false); })
      .catch(() => { showSnackbar('Could not load offers', 'error'); setLoading(false); });
  };

  useEffect(() => { loadOffers(); }, []); // eslint-disable-line

  const accept = async (id: number) => {
    setActionLoading(id);
    try { await negotiationService.acceptOffer(id); showSnackbar('Offer accepted!', 'success'); loadOffers(); }
    catch { showSnackbar('Accept failed', 'error'); }
    finally { setActionLoading(null); }
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    setRejecting(true);
    try { await negotiationService.rejectOffer(rejectTarget.id); showSnackbar('Offer rejected', 'info'); loadOffers(); }
    catch { showSnackbar('Reject failed', 'error'); }
    finally { setRejecting(false); setRejectTarget(null); }
  };

  const counter = async (id: number) => {
    if (!counterPrice) return;
    setActionLoading(id);
    try { await negotiationService.counterOffer(id, parseFloat(counterPrice)); showSnackbar('Counter offer sent!', 'success'); setCounterTarget(null); setCounterPrice(''); loadOffers(); }
    catch { showSnackbar('Counter offer failed', 'error'); }
    finally { setActionLoading(null); }
  };

  const pendingCount = offers.filter(o => o.status === 'PENDING').length;

  return (
    <Box>
      <PageHeader
        title="Received Offers"
        subtitle="Offers from buyers on your products"
        badge={pendingCount > 0 ? <Chip label={`${pendingCount} pending`} size="small" sx={{ bgcolor: alpha(solostock.accent.orange, 0.1), color: solostock.accent.orange, fontWeight: 700, fontSize: '0.75rem', border: `1px solid ${alpha(solostock.accent.orange, 0.3)}` }} /> : undefined}
      />

      {loading && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
          {[1, 2, 3].map(i => <Skeleton key={i} variant="rounded" height={220} />)}
        </Box>
      )}

      {!loading && offers.length === 0 && (
        <EmptyState icon="📥" message="No offers received yet" description="Buyers will make offers on your products from the catalog." />
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
        {offers.map(offer => {
          const color = STATUS_COLOR[offer.status] || solostock.text.muted;
          return (
            <GlassCard key={offer.id} hover={false} sx={{ p: '20px', borderColor: offer.status === 'PENDING' ? alpha(solostock.accent.orange, 0.4) : undefined }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'flex-start' }}>
                <Typography sx={{ fontWeight: 600, color: solostock.text.primary }}>{offer.productName}</Typography>
                <Chip label={offer.status} size="small" sx={{ bgcolor: alpha(color, 0.1), color, fontWeight: 700, fontSize: '0.65rem', height: 20 }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ color: solostock.text.muted, fontSize: '0.84rem' }}>Buyer #:</Typography>
                <Typography sx={{ color: solostock.text.secondary, fontSize: '0.84rem' }}>{offer.buyerId}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ color: solostock.text.muted, fontSize: '0.84rem' }}>Offered Price:</Typography>
                <Typography sx={{ color: solostock.text.primary, fontWeight: 600 }}>{offer.proposedPrice} MAD</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ color: solostock.text.muted, fontSize: '0.84rem' }}>Qty:</Typography>
                <Typography sx={{ color: solostock.text.primary }}>{offer.quantity}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: solostock.text.muted, fontSize: '0.84rem' }}>Total:</Typography>
                <Typography sx={{ color: solostock.text.primary, fontWeight: 700 }}>{(offer.proposedPrice * offer.quantity).toFixed(2)} MAD</Typography>
              </Box>
              {offer.message && <Typography sx={{ color: solostock.text.muted, fontSize: '0.84rem', fontStyle: 'italic', mb: 1 }}>"{offer.message}"</Typography>}

              {offer.status === 'PENDING' && (
                <Box sx={{ mt: 1.5 }}>
                  {counterTarget === offer.id ? (
                    <Box>
                      <TextField fullWidth size="small" type="number" placeholder="Counter price (MAD)" value={counterPrice} onChange={e => setCounterPrice(e.target.value)} sx={{ mb: 1 }} />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button fullWidth variant="outlined" size="small" onClick={() => { setCounterTarget(null); setCounterPrice(''); }} sx={{ borderColor: solostock.border.default, color: solostock.text.secondary }}>Cancel</Button>
                        <Button fullWidth variant="contained" size="small" disabled={actionLoading === offer.id || !counterPrice} onClick={() => counter(offer.id)} sx={{ bgcolor: solostock.accent.orange, '&:hover': { bgcolor: solostock.accent.orange, filter: 'brightness(0.9)' } }}>
                          {actionLoading === offer.id ? '…' : 'Send Counter'}
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button fullWidth variant="contained" color="success" size="small" disabled={actionLoading === offer.id} onClick={() => accept(offer.id)}>
                        {actionLoading === offer.id ? '…' : 'Accept'}
                      </Button>
                      <Button fullWidth variant="contained" color="error" size="small" disabled={actionLoading === offer.id} onClick={() => setRejectTarget(offer)}>
                        {actionLoading === offer.id ? '…' : 'Reject'}
                      </Button>
                      <Button fullWidth variant="outlined" size="small" disabled={actionLoading === offer.id}
                        onClick={() => { setCounterTarget(offer.id); setCounterPrice(String(offer.proposedPrice)); }}
                        sx={{ borderColor: solostock.border.strong, color: solostock.text.primary }}>
                        Counter
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
              {offer.status === 'PAID' && (
                <Box sx={{ mt: 1.5, textAlign: 'center', p: 1, borderRadius: '2px', bgcolor: `${solostock.accent.green}1A`, color: solostock.accent.green, fontWeight: 600, fontSize: '0.875rem' }}>✓ Payment Received</Box>
              )}
            </GlassCard>
          );
        })}
      </Box>

      <ConfirmDialog open={!!rejectTarget} title="Reject Offer" message={`Are you sure you want to reject the offer on "${rejectTarget?.productName}"? The buyer will be notified.`} confirmLabel="Reject" variant="danger" loading={rejecting} onConfirm={confirmReject} onCancel={() => setRejectTarget(null)} />
    </Box>
  );
};

export default ReceivedOffers;