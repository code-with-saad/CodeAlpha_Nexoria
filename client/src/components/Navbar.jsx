import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Sun, Moon, Store, Heart, Package, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems, openCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const [dark, setDark] = useState(() => localStorage.getItem('nexoria_theme') === 'dark');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
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
            <li>
              <NavLink to="/wishlist" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                Wishlist
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
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            type="button"
            onClick={openCart}
            className="btn btn-outline"
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.875rem', position: 'relative', gap: '0.4rem' }}
            aria-label="Open cart drawer"
          >
            <ShoppingCart size={18} />
            Cart
            {totalItems > 0 && (
              <span style={{
                background: 'var(--color-accent)', color: 'var(--color-on-accent)',
                fontSize: '0.72rem', fontWeight: 800,
                borderRadius: 'var(--radius-full)', padding: '0.1rem 0.45rem',
                minWidth: '20px', textAlign: 'center', lineHeight: '1.4'
              }}>
                {totalItems}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="user-dropdown-container" ref={dropdownRef}>
              <button
                type="button"
                className="user-badge-pill"
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-expanded={dropdownOpen}
                aria-label="User menu"
              >
                <User size={15} />
                <span>{user?.name}</span>
                {isAdmin && <span className="admin-tag">Admin</span>}
                <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {dropdownOpen && (
                <div className="user-dropdown-menu">
                  <Link
                    to="/profile"
                    className="user-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={16} />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/orders"
                    className="user-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Package size={16} />
                    <span>My Orders</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    className="user-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Heart size={16} />
                    <span>Wishlist</span>
                  </Link>
                  <div className="user-dropdown-divider" />
                  <button
                    type="button"
                    className="user-dropdown-item destructive"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
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
