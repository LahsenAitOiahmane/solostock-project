import React, { useEffect, useState } from 'react';
import {
  Box, Button, Chip, Skeleton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Typography, IconButton, alpha, Grid, Tooltip, MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../components/ui/SnackbarProvider';
import catalogService from '../services/catalogService';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { solostock } from '../theme';

interface Product { id: number; name: string; description: string; wholesalePrice: number; stockQuantity: number; category: string; supplierId: number; }

const LIME = solostock.accent.blue;
const GREEN = solostock.accent.green;
const PINK = solostock.accent.pink;
const CYAN = solostock.accent.cyan;

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '2px',
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: LIME, borderWidth: 2 },
  },
};

const ProductCard = ({ product, onEdit, onDelete }: { product: Product, onEdit: (p: Product) => void, onDelete: (p: Product) => void }) => {
  const inStock = product.stockQuantity > 0;
  const lowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

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
        '&:hover': {
          borderColor: alpha(LIME, 0.35),
          boxShadow: `0 8px 32px ${alpha(LIME, 0.1)}`,
          '& .product-actions': { opacity: 1 },
        },
      }}
    >
      <Box sx={{ height: 3, background: inStock ? `linear-gradient(90deg, ${LIME}, ${alpha(LIME, 0.3)})` : `linear-gradient(90deg, ${PINK}, ${alpha(PINK, 0.3)})` }} />
      <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 42, height: 42, borderRadius: '2px', bgcolor: alpha(LIME, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <InventoryOutlinedIcon sx={{ fontSize: 22, color: LIME }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: solostock.text.primary, lineHeight: 1.2, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                {product.name}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: solostock.text.muted }}>ID #{product.id}</Typography>
            </Box>
          </Box>
          {product.category && (
            <Chip
              label={product.category}
              size="small"
              sx={{ bgcolor: alpha(CYAN, 0.1), color: CYAN, border: `1px solid ${alpha(CYAN, 0.25)}`, fontWeight: 600, fontSize: '0.7rem', height: 22, flexShrink: 0 }}
            />
          )}
        </Box>

        {/* Description */}
        <Typography sx={{ color: solostock.text.secondary, fontSize: '0.84rem', mb: 2.5, lineHeight: 1.6, flex: 1 }}>
          {product.description || 'No description provided.'}
        </Typography>

        {/* Pricing */}
        <Box sx={{ p: 2, bgcolor: solostock.bg.tertiary, borderRadius: '2px', mb: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '0.68rem', color: solostock.text.muted, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em', mb: 0.3 }}>Wholesale Price</Typography>
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: GREEN, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              {product.wholesalePrice.toLocaleString()} <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>MAD</span>
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.68rem', color: solostock.text.muted, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em', mb: 0.3 }}>In Stock</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              {lowStock && <WarningAmberOutlinedIcon sx={{ fontSize: 14, color: solostock.accent.orange }} />}
              <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: inStock ? solostock.text.primary : PINK, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                {product.stockQuantity}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: solostock.text.muted }}>units</Typography>
            </Box>
          </Box>
        </Box>

        {/* Stock status */}
        {!inStock && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, bgcolor: alpha(PINK, 0.08), borderRadius: '2px', mb: 2, border: `1px solid ${alpha(PINK, 0.2)}` }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: PINK }} />
            <Typography sx={{ fontSize: '0.78rem', color: PINK, fontWeight: 500 }}>Out of stock — not visible to buyers</Typography>
          </Box>
        )}
        {lowStock && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, bgcolor: alpha(solostock.accent.orange, 0.08), borderRadius: '2px', mb: 2, border: `1px solid ${alpha(solostock.accent.orange, 0.2)}` }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: solostock.accent.orange }} />
            <Typography sx={{ fontSize: '0.78rem', color: solostock.accent.orange, fontWeight: 500 }}>Low stock — consider restocking</Typography>
          </Box>
        )}

        {/* Actions */}
        <Box
          className="product-actions"
          sx={{ display: 'flex', gap: 1, mt: 'auto', pt: 2, borderTop: `1px solid ${solostock.border.subtle}`, opacity: 1, transition: 'opacity 0.2s' }}
        >
          <Tooltip title="Edit Product">
            <IconButton
              size="small"
              onClick={() => onEdit(product)}
              sx={{ flex: 1, borderRadius: '2px', color: LIME, bgcolor: alpha(LIME, 0.08), border: `1px solid ${alpha(LIME, 0.2)}`, '&:hover': { bgcolor: alpha(LIME, 0.15) }, gap: 0.5 }}
            >
              <EditOutlinedIcon fontSize="small" />
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Edit</Typography>
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Product">
            <IconButton
              size="small"
              onClick={() => onDelete(product)}
              sx={{ flex: 1, borderRadius: '2px', color: PINK, bgcolor: alpha(PINK, 0.08), border: `1px solid ${alpha(PINK, 0.2)}`, '&:hover': { bgcolor: alpha(PINK, 0.15) }, gap: 0.5 }}
            >
              <DeleteOutlineIcon fontSize="small" />
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Delete</Typography>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

const MyProducts: React.FC = () => {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const userId = user?.id || 0;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({ name: '', description: '', wholesalePrice: 0, stockQuantity: 0, category: '' });

  const loadProducts = () => {
    setLoading(true);
    const fetch = userId > 0 ? catalogService.getProductsBySupplier(userId) : catalogService.getProducts();
    fetch.then(data => { setProducts(data as Product[]); setLoading(false); })
      .catch(() => { showSnackbar('Could not load products', 'error'); setLoading(false); });
  };

  useEffect(() => { loadProducts(); }, []); // eslint-disable-line

  const handleOpen = (p?: Product) => {
    if (p) { setForm({ ...p }); }
    else { setForm({ name: '', description: '', wholesalePrice: 0, stockQuantity: 0, category: '' }); }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.wholesalePrice || !form.stockQuantity) return;
    setSubmitting(true);
    try {
      if (form.id) { await catalogService.updateProduct(form.id, form as any); showSnackbar('Product updated successfully', 'success'); }
      else { await catalogService.createProduct({ ...form, supplierId: userId, supplierName: user?.company || user?.fullName || 'Supplier' } as any); showSnackbar('Product created successfully', 'success'); }
      setDialogOpen(false); loadProducts();
    } catch { showSnackbar('Failed to save product', 'error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try { await catalogService.deleteProduct(deleteTarget.id); showSnackbar('Product deleted', 'success'); loadProducts(); }
    catch { showSnackbar('Failed to delete product', 'error'); }
    finally { setSubmitting(false); setDeleteTarget(null); }
  };

  const totalValue = products.reduce((sum, p) => sum + (p.wholesalePrice * p.stockQuantity), 0);
  const outOfStock = products.filter(p => p.stockQuantity === 0).length;

  return (
    <Box>
      <PageHeader title="My Products" subtitle="Manage your catalog listings" actionLabel="Add Product" actionIcon={<AddIcon />} onAction={() => handleOpen()} />

      {/* Summary strip */}
      {!loading && products.length > 0 && (
        <Box className="animate-fade-in-up" sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          {[
            { icon: <InventoryOutlinedIcon />, label: 'Total Listings', value: products.length.toString(), color: LIME },
            { icon: <TrendingUpOutlinedIcon />, label: 'Catalog Value', value: `${totalValue.toLocaleString()} MAD`, color: GREEN },
            { icon: <WarningAmberOutlinedIcon />, label: 'Out of Stock', value: outOfStock.toString(), color: outOfStock > 0 ? PINK : solostock.text.muted },
          ].map(({ icon, label, value, color }) => (
            <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.5, bgcolor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px', borderLeft: `3px solid ${color}` }}>
              {React.cloneElement(icon, { sx: { fontSize: 18, color } })}
              <Box>
                <Typography sx={{ fontSize: '0.7rem', color: solostock.text.muted, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>{label}</Typography>
                <Typography sx={{ fontWeight: 700, color: solostock.text.primary, fontSize: '0.95rem', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{value}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {loading && (
        <Grid container spacing={2.5}>
          {[1, 2, 3].map(i => (
            <Grid item xs={12} sm={6} lg={4} key={i}>
              <Box sx={{ bgcolor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px', overflow: 'hidden' }}>
                <Box sx={{ height: 3, bgcolor: solostock.bg.tertiary }} />
                <Box sx={{ p: 3 }}>
                  <Skeleton width="60%" height={20} sx={{ mb: 1 }} />
                  <Skeleton width="100%" height={14} />
                  <Skeleton width="80%" height={14} sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" height={60} sx={{ borderRadius: '2px', mb: 2 }} />
                  <Skeleton variant="rectangular" height={36} sx={{ borderRadius: '2px' }} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && products.length === 0 && (
        <EmptyState icon="📦" message="No products yet" description="List your first product to start receiving offers." ctaLabel="Add Product" onCta={() => handleOpen()} />
      )}

      <Grid container spacing={2.5}>
        {products.map((product, i) => (
          <Grid item xs={12} sm={6} lg={4} key={product.id} className={`animate-delay-${Math.min(i + 1, 6)}`}>
            <ProductCard product={product} onEdit={handleOpen} onDelete={setDeleteTarget} />
          </Grid>
        ))}
      </Grid>

      {/* Edit/Add Dialog */}
      <Dialog
        open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '2px', border: `1px solid ${solostock.border.default}` } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontFamily: '"Plus Jakarta Sans", sans-serif', borderBottom: `1px solid ${solostock.border.default}` }}>
          {form.id ? '✏️ Edit Product' : '➕ Add New Product'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'grid', gap: 2.5, pt: 1 }}>
            <TextField label="Product Name" fullWidth value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} sx={fieldSx} required />
            <TextField label="Description" fullWidth multiline rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} sx={fieldSx} />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField label="Wholesale Price (MAD)" type="number" fullWidth value={form.wholesalePrice || ''} onChange={e => setForm({ ...form, wholesalePrice: parseFloat(e.target.value) })} sx={fieldSx} required />
              <TextField label="Stock Quantity" type="number" fullWidth value={form.stockQuantity || ''} onChange={e => setForm({ ...form, stockQuantity: parseInt(e.target.value) })} sx={fieldSx} required />
            </Box>
            <TextField select label="Category" fullWidth value={form.category || 'AUTRE'} onChange={e => setForm({ ...form, category: e.target.value })} sx={fieldSx}>
              {['AUTRE', 'INFORMATIQUE', 'TEXTILE', 'MATERIEL_BUREAU', 'ALIMENTAIRE', 'ELECTRONIQUE', 'COSMETIQUE', 'MOBILIER'].map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1, borderTop: `1px solid ${solostock.border.default}` }}>
          <Button onClick={() => setDialogOpen(false)} variant="outlined" sx={{ borderColor: solostock.border.default, color: solostock.text.secondary }}>Cancel</Button>
          <Button
            onClick={handleSave} variant="contained"
            disabled={submitting || !form.name || !form.wholesalePrice || !form.stockQuantity}
            sx={{ bgcolor: LIME, color: '#000', fontWeight: 700, flex: 1, '&:hover': { bgcolor: '#aee019' }, '&:disabled': { bgcolor: alpha(LIME, 0.4) } }}
          >
            {submitting ? 'Saving…' : form.id ? 'Save Changes' : 'Add Product'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={submitting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
};

export default MyProducts;