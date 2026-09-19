import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Sun, Moon, Store, Heart, Package, ChevronDown, Menu, X, Info, Phone, Home, ShoppingBag, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems, openCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [dark, setDark] = useState(() => localStorage.getItem('nexoria_theme') === 'dark');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
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

        {/* DESKTOP NAV LINKS */}
        <nav aria-label="Main Navigation">
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
              <NavLink to="/about" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                Contact
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
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="user-dropdown-item"
                      style={{ color: 'var(--color-primary)', fontWeight: 700 }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Shield size={16} />
                      <span>Admin Portal</span>
                    </Link>
                  )}
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

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            aria-controls="mobile-nav-menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER & BACKDROP */}
      {mobileMenuOpen && (
        <div className="mobile-nav-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div
            id="mobile-nav-menu"
            className="mobile-nav-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Mobile Navigation Menu"
          >
            <div className="mobile-nav-header">
              <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
                <Store size={22} />
                Nexoria
              </Link>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                style={{ padding: '0.4rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-nav-body">
              <NavLink
                to="/"
                end
                className={({ isActive }) => 'mobile-nav-link' + (isActive ? ' active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home size={18} />
                <span>Home</span>
              </NavLink>

              <NavLink
                to="/products"
                className={({ isActive }) => 'mobile-nav-link' + (isActive ? ' active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingBag size={18} />
                <span>Products Catalog</span>
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) => 'mobile-nav-link' + (isActive ? ' active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Info size={18} />
                <span>About Us</span>
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) => 'mobile-nav-link' + (isActive ? ' active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Phone size={18} />
                <span>Contact &amp; Support</span>
              </NavLink>

              <NavLink
                to="/wishlist"
                className={({ isActive }) => 'mobile-nav-link' + (isActive ? ' active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart size={18} />
                <span>My Wishlist</span>
              </NavLink>

              {isAuthenticated && (
                <>
                  {isAdmin && (
                    <NavLink
                      to="/admin"
                      className={({ isActive }) => 'mobile-nav-link' + (isActive ? ' active' : '')}
                      style={{ color: 'var(--color-primary)', fontWeight: 700 }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Shield size={18} />
                      <span>Admin Portal</span>
                    </NavLink>
                  )}

                  <NavLink
                    to="/orders"
                    className={({ isActive }) => 'mobile-nav-link' + (isActive ? ' active' : '')}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package size={18} />
                    <span>My Orders</span>
                  </NavLink>

                  <NavLink
                    to="/profile"
                    className={({ isActive }) => 'mobile-nav-link' + (isActive ? ' active' : '')}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>Account Profile</span>
                  </NavLink>
                </>
              )}
            </div>

            <div className="mobile-nav-footer">
              {isAuthenticated ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.75rem', background: 'var(--color-muted)', borderRadius: 'var(--radius-md)' }}>
                    <User size={18} color="var(--color-primary)" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user?.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user?.email}
                      </div>
                    </div>
                    {isAdmin && <span className="admin-tag">Admin</span>}
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'center', color: 'var(--color-destructive)' }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <Link
                    to="/login"
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
