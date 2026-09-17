import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out successfully.', { title: 'Logged Out' });
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="brand-logo">
          <span>🛍️ Nexoria</span>
          <span className="brand-badge">MERN</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Products
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="nav-actions">
          <Link
            to="/cart"
            className="btn btn-outline"
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.875rem' }}
          >
            🛒 Cart (0)
          </Link>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div className="user-badge-pill">
                <span>👤 {user?.name}</span>
                {isAdmin && <span className="admin-tag">Admin</span>}
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-ghost"
                title="Sign Out"
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to="/login"
                className="btn btn-outline"
                style={{ padding: '0.45rem 0.95rem', fontSize: '0.875rem' }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.875rem' }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
