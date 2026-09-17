import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🛍️ Nexoria
          </h3>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#94a3b8' }}>
            Full-stack MERN e-commerce store built for high performance, verified product quality, and rapid checkout experience.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '0.75rem' }}>Quick Navigation</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <li><Link to="/" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>Home</Link></li>
            <li><Link to="/products" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>All Products</Link></li>
            <li><Link to="/cart" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>Shopping Cart</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '0.75rem' }}>Architecture</h4>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6' }}>
            <strong>Frontend:</strong> React 19 + Vite<br />
            <strong>Backend:</strong> Express.js + Node.js<br />
            <strong>Database:</strong> MongoDB + Mongoose
          </p>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Nexoria Store. CodeAlpha Full-Stack Internship Project.</p>
      </div>
    </footer>
  );
}
