import React, { useEffect, useState } from 'react';
import {
  Box, TextField, InputAdornment, Chip, Skeleton, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, Typography, alpha, Grid,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../components/ui/SnackbarProvider';
import catalogService from '../services/catalogService';
import negotiationService from '../services/negotiationService';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { solostock } from '../theme';

const LIME = solostock.accent.blue;
const GREEN = solostock.accent.green;

interface Product {
  id: number; name: string; description: string; wholesalePrice: number;
  stockQuantity: number; category: string; supplierName: string; supplierId: number;
}
interface OfferForm { proposedPrice: string; quantity: string; message: string; }

const CATEGORY_COLORS: Record<string, string> = {
  Electronics: solostock.accent.blue,
  Infrastructure: solostock.accent.cyan,
  Materials: solostock.accent.orange,
  Textiles: solostock.accent.pink,
  Food: solostock.accent.green,
};

const ProductCard = ({ product, canMakeOffer, onOffer }: { product: Product, canMakeOffer: boolean, onOffer: (p: Product) => void }) => {
  const catColor = CATEGORY_COLORS[product.category] || solostock.accent.cyan;
  const inStock = product.stockQuantity > 0;

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
          borderColor: alpha(catColor, 0.4),
          boxShadow: `0 8px 32px ${alpha(catColor, 0.12)}`,
        },
      }}
    >
      {/* Color stripe */}
      <Box sx={{ height: 3, background: `linear-gradient(90deg, ${catColor}, ${alpha(catColor, 0.3)})` }} />

      <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '2px', bgcolor: alpha(catColor, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <InventoryOutlinedIcon sx={{ fontSize: 22, color: catColor }} />
          </Box>
          <Chip
            label={product.category}
            size="small"
            sx={{ bgcolor: alpha(catColor, 0.1), color: catColor, border: `1px solid ${alpha(catColor, 0.25)}`, fontWeight: 600, fontSize: '0.7rem', height: 22 }}
          />
        </Box>

        {/* Name */}
        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: solostock.text.primary, mb: 1, lineHeight: 1.3, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          {product.name}
        </Typography>

        {/* Supplier */}
        <Typography sx={{ color: solostock.text.muted, fontSize: '0.78rem', mb: 1.5 }}>
          by {product.supplierName}
        </Typography>

        {/* Description */}
        <Typography sx={{ color: solostock.text.secondary, fontSize: '0.84rem', mb: 3, lineHeight: 1.6, flex: 1 }}>
          {product.description}
        </Typography>

        {/* Pricing row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: solostock.bg.tertiary, borderRadius: '2px', mb: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: solostock.text.muted, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em', mb: 0.3 }}>Wholesale Price</Typography>
            <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: GREEN, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              {product.wholesalePrice.toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>MAD</span>
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: '0.7rem', color: solostock.text.muted, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em', mb: 0.3 }}>Stock</Typography>
            <Chip
              label={inStock ? `${product.stockQuantity} units` : 'Out of stock'}
              size="small"
              sx={{ bgcolor: alpha(inStock ? GREEN : solostock.accent.pink, 0.1), color: inStock ? GREEN : solostock.accent.pink, fontWeight: 700, fontSize: '0.75rem', height: 24 }}
            />
          </Box>
        </Box>

        {/* CTA */}
        {canMakeOffer && (
          <Button
            variant="contained" fullWidth
            startIcon={<LocalOfferOutlinedIcon />}
            onClick={() => onOffer(product)}
            disabled={!inStock}
            sx={{
              bgcolor: LIME, color: '#000', fontWeight: 700,
              '&:hover': { bgcolor: '#aee019', transform: 'translateY(-1px)', boxShadow: `0 6px 20px ${alpha(LIME, 0.3)}` },
              '&:disabled': { bgcolor: alpha(LIME, 0.3), color: 'rgba(0,0,0,0.4)' },
              transition: 'all 0.2s',
            }}
          >
            Make an Offer
          </Button>
        )}
      </Box>
    </Box>
  );
};

const Catalog: React.FC = () => {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const canMakeOffer = user?.role !== 'FOURNISSEUR';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [offerTarget, setOfferTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<OfferForm>({ proposedPrice: '', quantity: '1', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    catalogService.getProducts()
      .then(data => { setProducts(data as Product[]); setLoading(false); })
      .catch(() => { showSnackbar('Could not load products', 'error'); setLoading(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openOffer = (product: Product) => {
    setOfferTarget(product);
    setForm({ proposedPrice: String(product.wholesalePrice), quantity: '1', message: '' });
  };

  const submitOffer = async () => {
    if (!offerTarget || !user) return;
    setSubmitting(true);
    try {
      await negotiationService.createOffer({
        productId: offerTarget.id, productName: offerTarget.name,
        buyerId: user.id, supplierId: offerTarget.supplierId,
        proposedPrice: parseFloat(form.proposedPrice), originalPrice: offerTarget.wholesalePrice,
        quantity: parseInt(form.quantity), message: form.message,
      });
      showSnackbar('Offer submitted successfully!', 'success');
      setOfferTarget(null);
    } catch {
      showSnackbar('Failed to submit offer. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <Box>
      <PageHeader title="Product Catalog" subtitle={`${products.length} products available`} />

      {/* Search & Filter Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search products, descriptions…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          sx={{
            flex: 1, minWidth: 220, maxWidth: 380,
            '& .MuiOutlinedInput-root': {
              borderRadius: '2px',
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: LIME },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: LIME },
            },
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchOutlinedIcon sx={{ color: solostock.text.muted, fontSize: 18 }} /></InputAdornment>,
          }}
        />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <FilterListOutlinedIcon sx={{ fontSize: 18, color: solostock.text.muted }} />
          {categories.map(cat => (
            <Chip
              key={cat}
              label={cat}
              size="small"
              onClick={() => setActiveCategory(cat)}
              sx={{
                cursor: 'pointer',
                bgcolor: activeCategory === cat ? LIME : solostock.bg.tertiary,
                color: activeCategory === cat ? '#000' : solostock.text.secondary,
                border: `1px solid ${activeCategory === cat ? LIME : solostock.border.default}`,
                fontWeight: activeCategory === cat ? 700 : 500,
                transition: 'all 0.2s',
                '&:hover': { bgcolor: activeCategory === cat ? '#aee019' : solostock.bg.secondary },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Results count */}
      {!loading && (
        <Typography sx={{ color: solostock.text.muted, fontSize: '0.85rem', mb: 3 }}>
          Showing <strong style={{ color: solostock.text.primary }}>{filtered.length}</strong> of {products.length} products
          {search && <span> for "<em>{search}</em>"</span>}
        </Typography>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <Grid container spacing={2.5}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Grid item xs={12} sm={6} lg={4} key={i}>
              <Box sx={{ bgcolor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px', overflow: 'hidden' }}>
                <Box sx={{ height: 3, bgcolor: solostock.bg.tertiary }} />
                <Box sx={{ p: 3 }}>
                  <Skeleton variant="rectangular" width={44} height={44} sx={{ borderRadius: '2px', mb: 2 }} />
                  <Skeleton width="70%" height={20} sx={{ mb: 1 }} />
                  <Skeleton width="40%" height={14} sx={{ mb: 1.5 }} />
                  <Skeleton width="100%" height={14} />
                  <Skeleton width="85%" height={14} sx={{ mb: 3 }} />
                  <Skeleton variant="rectangular" height={48} sx={{ borderRadius: '2px' }} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && filtered.length === 0 && (
        <EmptyState icon="📦" message="No products found" description={search ? 'Try adjusting your search or category filter' : 'No products available yet'} />
      )}

      <Grid container spacing={2.5}>
        {filtered.map((product, i) => (
          <Grid item xs={12} sm={6} lg={4} key={product.id} className={`animate-delay-${Math.min(i % 6 + 1, 6)}`}>
            <ProductCard product={product} canMakeOffer={canMakeOffer} onOffer={openOffer} />
          </Grid>
        ))}
      </Grid>

      {/* Offer Dialog */}
      <Dialog
        open={!!offerTarget} onClose={() => setOfferTarget(null)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: '2px', border: `1px solid ${solostock.border.default}` } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontFamily: '"Plus Jakarta Sans", sans-serif', pb: 1 }}>
          Make an Offer
        </DialogTitle>
        <DialogContent>
          {offerTarget && (
            <Box sx={{ p: 2, mb: 3, bgcolor: solostock.bg.tertiary, borderRadius: '2px', border: `1px solid ${solostock.border.default}`, borderLeft: `3px solid ${LIME}` }}>
              <Typography sx={{ fontWeight: 700, color: solostock.text.primary, mb: 0.5 }}>{offerTarget.name}</Typography>
              <Typography sx={{ color: solostock.text.muted, fontSize: '0.8rem' }}>
                {offerTarget.supplierName} · Listed at {offerTarget.wholesalePrice.toLocaleString()} MAD
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField fullWidth label="Proposed Price (MAD)" type="number" value={form.proposedPrice}
              onChange={e => setForm({ ...form, proposedPrice: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '2px', '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: LIME } } }} />
            <TextField fullWidth label="Quantity (units)" type="number" value={form.quantity}
              onChange={e => setForm({ ...form, quantity: e.target.value })} inputProps={{ min: 1 }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '2px', '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: LIME } } }} />
            <TextField fullWidth label="Message to Supplier (optional)" multiline rows={2} value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '2px', '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: LIME } } }} />
            {form.proposedPrice && form.quantity && (
              <Box sx={{ p: 2, bgcolor: alpha(LIME, 0.08), borderRadius: '2px', border: `1px solid ${alpha(LIME, 0.2)}` }}>
                <Typography sx={{ fontSize: '0.8rem', color: solostock.text.muted, mb: 0.5 }}>Total Offer Value</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: solostock.text.primary, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                  {(parseFloat(form.proposedPrice || '0') * parseInt(form.quantity || '1')).toLocaleString()} MAD
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setOfferTarget(null)} variant="outlined"
            sx={{ borderColor: solostock.border.default, color: solostock.text.secondary, '&:hover': { borderColor: solostock.border.strong } }}>
            Cancel
          </Button>
          <Button onClick={submitOffer} variant="contained" disabled={submitting || !form.proposedPrice || !form.quantity}
            sx={{ bgcolor: LIME, color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#aee019' }, flex: 1 }}>
            {submitting ? 'Submitting…' : 'Submit Offer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Catalog;