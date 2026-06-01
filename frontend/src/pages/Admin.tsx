import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography, alpha, IconButton, Tooltip } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../components/ui/SnackbarProvider';
import catalogService from '../services/catalogService';
import negotiationService from '../services/negotiationService';
import PageHeader from '../components/ui/PageHeader';
import { solostock } from '../theme';
import authService from '../services/authService';

interface TabPanelProps { children?: React.ReactNode; index: number; value: number; }
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return <div role="tabpanel" hidden={value !== index} {...other}>{value === index && (<Box sx={{ pt: 3 }}>{children}</Box>)}</div>;
};

const Admin: React.FC = () => {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [tab, setTab] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    Promise.all([catalogService.getProducts(), negotiationService.getAllOffers(), authService.getUsers()])
      .then(([pData, oData, uData]) => { 
        setProducts(pData as any[]); 
        setOffers(oData as any[]); 
        setUsers(uData as any[]);
        setLoading(false); 
      })
      .catch(() => { showSnackbar('Failed to load admin data', 'error'); setLoading(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (user?.role !== 'ADMIN') {
    return <Box sx={{ p: 4, textAlign: 'center' }}><Typography sx={{ color: solostock.accent.pink }}>Unauthorized access</Typography></Box>;
  }

  const STATUS_COLOR: Record<string, string> = { PENDING: solostock.accent.orange, ACCEPTED: solostock.accent.green, REJECTED: solostock.accent.pink, COUNTER_OFFERED: solostock.accent.cyan, PAID: solostock.accent.blue };

  const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await authService.updateUserStatus(userId, !currentStatus);
      showSnackbar(`User ${!currentStatus ? 'activated' : 'suspended'} successfully`, 'success');
      setUsers(users.map(u => u.id === userId ? { ...u, active: !currentStatus } : u));
    } catch (error) {
      showSnackbar('Failed to update user status', 'error');
    }
  };

  return (
    <Box>
      <PageHeader title="Admin Panel" subtitle="Platform oversight and management" />

      <Box sx={{ borderBottom: 1, borderColor: solostock.border.default }}>
        <Tabs value={tab} onChange={(_: any, v: any) => setTab(v)} sx={{ minHeight: '44px', '& .MuiTab-root': { color: solostock.text.secondary, '&.Mui-selected': { color: solostock.accent.blue } }, '& .MuiTabs-indicator': { backgroundColor: solostock.accent.blue } }}>
          <Tab label={`All Products (${products.length})`} />
          <Tab label={`All Offers (${offers.length})`} />
          <Tab label={`User Management (${users.length})`} />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ p: 4, textAlign: 'center' }}><Typography sx={{ color: solostock.text.muted }}>Loading data…</Typography></Box>
      ) : (
        <>
          <TabPanel value={tab} index={0}>
            <TableContainer component={Paper} elevation={0} sx={{ bgcolor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Stock</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell sx={{ color: solostock.text.muted }}>{p.id}</TableCell>
                      <TableCell sx={{ color: solostock.text.primary, fontWeight: 500 }}>{p.name}</TableCell>
                      <TableCell sx={{ color: solostock.text.secondary }}>{p.supplierName} (#{p.supplierId})</TableCell>
                      <TableCell><Chip label={p.category} size="small" sx={{ bgcolor: solostock.bg.tertiary, color: solostock.text.secondary, border: `1px solid ${solostock.border.default}`, height: 20, fontSize: '0.65rem' }} /></TableCell>
                      <TableCell align="right" sx={{ color: solostock.accent.green, fontWeight: 600 }}>{p.wholesalePrice} MAD</TableCell>
                      <TableCell align="right" sx={{ color: p.stockQuantity === 0 ? solostock.accent.pink : solostock.text.secondary }}>{p.stockQuantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <TableContainer component={Paper} elevation={0} sx={{ bgcolor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Buyer</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {offers.map((o: any) => {
                    const color = STATUS_COLOR[o.status] || solostock.text.muted;
                    return (
                      <TableRow key={o.id}>
                        <TableCell sx={{ color: solostock.text.muted }}>{o.id}</TableCell>
                        <TableCell sx={{ color: solostock.text.primary, fontWeight: 500 }}>{o.productName}</TableCell>
                        <TableCell sx={{ color: solostock.text.secondary }}>#{o.buyerId}</TableCell>
                        <TableCell sx={{ color: solostock.text.secondary }}>#{o.supplierId}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>{(o.proposedPrice * o.quantity).toFixed(2)} MAD</TableCell>
                        <TableCell>
                          <Chip label={o.status} size="small" sx={{ bgcolor: alpha(color, 0.1), color, border: `1px solid ${alpha(color, 0.3)}`, fontWeight: 600, height: 20, fontSize: '0.65rem' }} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tab} index={2}>
            <TableContainer component={Paper} elevation={0} sx={{ bgcolor: solostock.bg.secondary, border: `1px solid ${solostock.border.default}`, borderRadius: '2px' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Login</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(u => {
                    const statusStr = u.active ? 'ACTIVE' : 'SUSPENDED';
                    const statusColor = u.active ? solostock.accent.green : solostock.accent.pink;
                    return (
                    <TableRow key={u.id} hover sx={{ '&:hover': { bgcolor: solostock.bg.tertiary } }}>
                      <TableCell>
                        <Typography sx={{ color: solostock.text.primary, fontWeight: 600, fontSize: '0.9rem' }}>{u.fullName}</Typography>
                        <Typography sx={{ color: solostock.text.muted, fontSize: '0.75rem' }}>{u.email} • #{u.id}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={u.role} size="small" sx={{ bgcolor: alpha(u.role === 'FOURNISSEUR' ? solostock.accent.cyan : solostock.accent.blue, 0.1), color: u.role === 'FOURNISSEUR' ? solostock.accent.cyan : solostock.accent.blue, fontWeight: 600, height: 24, fontSize: '0.7rem' }} />
                      </TableCell>
                      <TableCell>
                        <Chip label={statusStr} size="small" sx={{ bgcolor: alpha(statusColor, 0.1), color: statusColor, border: `1px solid ${alpha(statusColor, 0.3)}`, fontSize: '0.7rem', fontWeight: 600, height: 24 }} />
                      </TableCell>
                      <TableCell sx={{ color: solostock.text.secondary, fontSize: '0.85rem' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Tooltip title={u.active ? "Suspend User" : "Reactivate User"}>
                            <IconButton onClick={() => handleToggleStatus(u.id, u.active)} size="small" sx={{ color: u.active ? solostock.accent.pink : solostock.accent.green, bgcolor: alpha(u.active ? solostock.accent.pink : solostock.accent.green, 0.1) }}>
                              {u.active ? <BlockIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reset Password">
                            <IconButton size="small" sx={{ color: solostock.text.secondary, bgcolor: solostock.bg.tertiary, '&:hover': { color: solostock.accent.blue } }}>
                              <RotateLeftIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </>
      )}
    </Box>
  );
};

export default Admin;