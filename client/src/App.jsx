import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRoute from './components/AdminRoute';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="app-layout">
              <Navbar />
              <CartDrawer />
              <main className="main-content" style={{ padding: 0 }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}><ProductsPage /></div>} />
                  <Route path="/products/:id" element={<div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}><ProductDetailPage /></div>} />
                  <Route path="/login" element={<div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}><LoginPage /></div>} />
                  <Route path="/register" element={<div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}><RegisterPage /></div>} />
                  <Route path="/cart" element={<div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}><CartPage /></div>} />
                  <Route path="/checkout" element={<div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}><CheckoutPage /></div>} />
                  <Route path="/order-confirmation/:id" element={<div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}><OrderConfirmationPage /></div>} />
                  <Route path="/orders" element={<div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}><OrderHistoryPage /></div>} />
                  <Route path="/wishlist" element={<div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}><WishlistPage /></div>} />
                  <Route path="/profile" element={<div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}><ProfilePage /></div>} />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
                          <AdminDashboardPage />
                        </div>
                      </AdminRoute>
                    }
                  />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}><ContactPage /></div>} />
                  <Route path="*" element={<div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}><NotFoundPage /></div>} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
