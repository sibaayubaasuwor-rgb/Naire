import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import SellerLayout from './components/layout/SellerLayout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MarketplacePage from './pages/MarketplacePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import SellerDashboardPage from './pages/seller/DashboardPage';
import SellerProductsPage from './pages/seller/ProductsPage';
import SellerOrdersPage from './pages/seller/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/admin/AdminPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
  },
});

export default function App() {
  const { initialize, isLoading } = useAuthStore();

  useEffect(() => { initialize(); }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Buyer routes */}
          <Route element={<ProtectedRoute roles={['buyer', 'admin']} />}>
            <Route element={<Layout />}>
              <Route path="/"               element={<MarketplacePage />} />
              <Route path="/product/:id"    element={<ProductDetailPage />} />
              <Route path="/cart"           element={<CartPage />} />
              <Route path="/checkout"       element={<CheckoutPage />} />
              <Route path="/orders"         element={<OrdersPage />} />
              <Route path="/orders/:id"     element={<OrderDetailPage />} />
              <Route path="/profile"        element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Seller routes */}
          <Route element={<ProtectedRoute roles={['seller', 'admin']} />}>
            <Route path="/seller" element={<SellerLayout />}>
              <Route index                  element={<SellerDashboardPage />} />
              <Route path="products"        element={<SellerProductsPage />} />
              <Route path="orders"          element={<SellerOrdersPage />} />
            </Route>
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}