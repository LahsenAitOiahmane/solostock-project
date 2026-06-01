import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, alpha, Grid, Skeleton,
} from '@mui/material';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../components/ui/SnackbarProvider';
import paymentService from '../services/paymentService';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { solostock } from '../theme';
import { Transaction } from '../types';

const LIME = solostock.accent.blue;
const GREEN = solostock.accent.green;

const METHOD_COLOR: Record<string, string> = {
  VIREMENT: solostock.accent.blue,
  CREDIT_CARD: solostock.accent.cyan,
  CREDIT: solostock.accent.orange,
  TRAITE: solostock.accent.cyan,
  CASH: GREEN,
};

const Payments: React.FC = () => {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const userId = user?.id || 0;
  const role = user?.role || 'ACHETEUR';

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = role === 'ACHETEUR' ? paymentService.getTransactionsByPayer(userId) : paymentService.getAllTransactions();
    fetch.then(data => {
      let result = data as Transaction[];
      if (role === 'FOURNISSEUR' && userId > 0) result = result.filter(t => t.receiverId === userId);
      setTransactions(result.sort((a, b) => {
        const dateA = Array.isArray(a.createdAt) ? new Date(a.createdAt[0], a.createdAt[1] - 1, a.createdAt[2], a.createdAt[3] || 0, a.createdAt[4] || 0).getTime() : new Date(a.createdAt || 0).getTime();
        const dateB = Array.isArray(b.createdAt) ? new Date(b.createdAt[0], b.createdAt[1] - 1, b.createdAt[2], b.createdAt[3] || 0, b.createdAt[4] || 0).getTime() : new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      }));
      setLoading(false);
    }).catch(() => { showSnackbar('Could not load transactions', 'error'); setLoading(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, role]);

  const totalAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const avgAmount = transactions.length > 0 ? totalAmount / transactions.length : 0;
  const pageTitle = role === 'FOURNISSEUR' ? 'Earnings' : 'Payments';

  return (
    <Box>
      <PageHeader
        title={pageTitle}
        subtitle={`Transaction history for ${user?.company || user?.fullName}`}
      />

      {/* Summary Cards */}
      {!loading && transactions.length > 0 && (
        <Grid container spacing={2.5} sx={{ mb: 4 }} className="animate-fade-in-up">
          {[
            {
              icon: <AccountBalanceWalletOutlinedIcon />,
              label: role === 'FOURNISSEUR' ? 'Total Earned' : 'Total Spent',
              value: `${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`,
              color: GREEN,
              sign: role === 'FOURNISSEUR' ? '+' : '-',
            },
            {
              icon: <ReceiptOutlinedIcon />,
              label: 'Transactions',
              value: transactions.length.toString(),
              color: LIME,
              sign: '',
            },
            {
              icon: <TrendingUpOutlinedIcon />,
              label: 'Average Value',
              value: `${avgAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`,
              color: solostock.accent.cyan,
              sign: '',
            },
          ].map(({ icon, label, value, color, sign }) => (
            <Grid item xs={12} sm={4} key={label}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: solostock.bg.secondary,
                  border: `1px solid ${solostock.border.default}`,
                  borderRadius: '2px',
                  borderLeft: `3px solid ${color}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: `0 4px 20px ${alpha(color, 0.1)}` },
                }}
              >
                <Box sx={{ width: 44, height: 44, borderRadius: '2px', bgcolor: alpha(color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {React.cloneElement(icon, { sx: { fontSize: 24, color } })}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: solostock.text.muted, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', mb: 0.3 }}>
                    {label}
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: solostock.text.primary, fontFamily: '"Plus Jakarta Sans", sans-serif', lineHeight: 1 }}>
                    {sign}{value}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <Box>
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            {[1, 2, 3].map(i => (
              <Grid item xs={12} sm={4} key={i}>
                <Skeleton variant="rectangular" height={80} sx={{ borderRadius: '2px' }} />
              </Grid>
            ))}
          </Grid>
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '2px' }} />
        </Box>
      )}

      {!loading && transactions.length === 0 && (
        <EmptyState icon="💳" message="No transactions yet" description="Completed payments will appear here." />
      )}

      {!loading && transactions.length > 0 && (
        <Box className="animate-fade-in-up animate-delay-2">
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', mb: 2, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Transaction History
          </Typography>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              bgcolor: solostock.bg.secondary,
              border: `1px solid ${solostock.border.default}`,
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {['Date', 'Transaction ID', ...(role === 'ADMIN' ? ['From', 'To'] : [role === 'FOURNISSEUR' ? 'From (Buyer)' : 'To (Supplier)']), 'Method', 'Amount'].map(h => (
                    <TableCell
                      key={h}
                      sx={{ bgcolor: solostock.bg.tertiary, color: solostock.text.muted, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((t, i) => {
                  const date = Array.isArray(t.createdAt)
                    ? new Date(t.createdAt[0], t.createdAt[1] - 1, t.createdAt[2], t.createdAt[3] || 0, t.createdAt[4] || 0)
                    : new Date(t.createdAt || 0);
                  const methodColor = METHOD_COLOR[t.method] || solostock.text.muted;
                  return (
                    <TableRow
                      key={t.id}
                      className={`animate-fade-in-up animate-delay-${Math.min(i + 1, 6)}`}
                      hover
                      sx={{ '&:hover': { bgcolor: solostock.bg.tertiary, transition: 'background-color 0.15s' } }}
                    >
                      <TableCell sx={{ color: solostock.text.secondary, fontSize: '0.85rem' }}>
                        {date.toLocaleDateString()}
                        <Typography sx={{ fontSize: '0.72rem', color: solostock.text.muted }}>
                          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ fontFamily: '"DM Mono", monospace', fontSize: '0.78rem', color: solostock.text.muted, bgcolor: solostock.bg.tertiary, px: 1.5, py: 0.5, borderRadius: '2px', display: 'inline-block' }}>
                          #{t.id.toString().padStart(6, '0')}
                        </Box>
                      </TableCell>
                      {role === 'ADMIN' ? (
                        <>
                          <TableCell sx={{ color: solostock.text.secondary, fontSize: '0.85rem' }}>User #{t.payerId}</TableCell>
                          <TableCell sx={{ color: solostock.text.secondary, fontSize: '0.85rem' }}>User #{t.receiverId}</TableCell>
                        </>
                      ) : (
                        <TableCell sx={{ color: solostock.text.secondary, fontSize: '0.85rem' }}>User #{role === 'FOURNISSEUR' ? t.payerId : t.receiverId}</TableCell>
                      )}
                      <TableCell>
                        <Chip
                          label={t.method}
                          size="small"
                          sx={{
                            bgcolor: alpha(methodColor, 0.1),
                            color: methodColor,
                            border: `1px solid ${alpha(methodColor, 0.25)}`,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            height: 22,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            color: role === 'FOURNISSEUR' ? GREEN : solostock.text.primary,
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                          }}
                        >
                          {role === 'FOURNISSEUR' ? '+' : ''}{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>MAD</span>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default Payments;