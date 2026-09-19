import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Sun, Moon, Store, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const [dark, setDark] = useState(() => localStorage.getItem('nexoria_theme') === 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('nexoria_theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
      localStorage.setItem('nexoria_theme', 'light');
    }
  }, [dark]);

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out successfully.', { title: 'Logged Out' });
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* BRAND */}
        <Link to="/" className="brand-logo">
          <Store size={24} />
          Nexoria
        </Link>

        {/* NAV LINKS */}
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                Products
              </NavLink>
            </li>
            {isAuthenticated && (
              <li>
                <NavLink to="/orders" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                  My Orders
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* ACTIONS */}
        <div className="nav-actions">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDark(d => !d)}
            className="btn btn-ghost"
            style={{ padding: '0.45rem', borderRadius: 'var(--radius-md)' }}
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            className="btn btn-outline"
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.875rem', position: 'relative', gap: '0.4rem' }}
          >
            <ShoppingCart size={18} />
            Cart
            {totalItems > 0 && (
              <span style={{
                background: 'var(--color-accent)', color: '#ffffff',
                fontSize: '0.72rem', fontWeight: 800,
                borderRadius: 'var(--radius-full)', padding: '0.1rem 0.45rem',
                minWidth: '20px', textAlign: 'center', lineHeight: '1.4'
              }}>
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div className="user-badge-pill">
                <User size={15} />
                <span>{user?.name}</span>
                {isAdmin && <span className="admin-tag">Admin</span>}
              </div>
              <button onClick={handleLogout} className="btn btn-ghost" title="Sign Out" style={{ gap: '0.35rem' }}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.45rem 0.95rem', fontSize: '0.875rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.875rem' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
