import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
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
            <li>
              <NavLink 
                to="/cart" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Cart
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="nav-actions">
          <Link to="/products" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            Explore
          </Link>
          <Link to="/cart" className="btn btn-primary" style={{ padding: '0.5rem 1.15rem', fontSize: '0.875rem' }}>
            🛒 Cart (0)
          </Link>
        </div>
      </div>
    </header>
  );
}
