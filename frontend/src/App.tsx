import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { theme } from './theme';
import { AuthProvider } from './context/AuthContext';
import { SnackbarProvider } from './components/ui/SnackbarProvider';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import NotFound from './components/NotFound';

// Lazy-loaded pages (code splitting)
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Catalog = lazy(() => import('./pages/Catalog'));
const Payments = lazy(() => import('./pages/Payments'));
const MyOffers = lazy(() => import('./pages/MyOffers'));
const ReceivedOffers = lazy(() => import('./pages/ReceivedOffers'));
const MyProducts = lazy(() => import('./pages/MyProducts'));
const Admin = lazy(() => import('./pages/Admin'));

// Suspense fallback — centered spinner
const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      bgcolor: 'background.default',
    }}
  >
    <CircularProgress size={40} sx={{ color: 'primary.main' }} />
  </Box>
);

const P = (element: React.ReactNode) => (
  <ProtectedRoute><Layout>{element}</Layout></ProtectedRoute>
);

const App: React.FC = () => (
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/dashboard"       element={P(<Dashboard />)} />
                <Route path="/catalog"         element={P(<Catalog />)} />
                <Route path="/payments"        element={P(<Payments />)} />

                {/* ACHETEUR */}
                <Route path="/my-offers"       element={P(<MyOffers />)} />

                {/* FOURNISSEUR */}
                <Route path="/my-products"     element={P(<MyProducts />)} />
                <Route path="/received-offers" element={P(<ReceivedOffers />)} />

                {/* ADMIN */}
                <Route path="/admin"           element={P(<Admin />)} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;