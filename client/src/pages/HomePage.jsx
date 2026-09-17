import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function HomePage() {
  const [apiStatus, setApiStatus] = useState({ loading: true, online: false, data: null });

  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/health/db', { timeout: 3000 });
        setApiStatus({ loading: false, online: true, data: response.data });
      } catch (err) {
        setApiStatus({ 
          loading: false, 
          online: false, 
          data: err.response?.data || { message: 'Server not reachable yet. Run `npm run dev` in /server.' } 
        });
      }
    };

    checkServerHealth();
  }, []);

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section style={{ 
        background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)', 
        color: '#ffffff', 
        padding: '4.5rem 0',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '3rem',
        boxShadow: 'var(--shadow-glow)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', padding: '0.35rem 1rem', borderRadius: 'var(--radius-full)', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 600 }}>
            <span>⚡ Phase 0: Project Setup Complete</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', color: '#ffffff', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            Elevate Your Shopping with Nexoria
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#d1fae5', lineHeight: '1.6', marginBottom: '2rem' }}>
            A high-performance full-stack MERN e-commerce store built with modern architecture, fluid interactions, and verified security.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-accent" style={{ fontSize: '1.05rem', padding: '0.85rem 2rem' }}>
              Explore Catalog 🚀
            </Link>
            <a href="#system-status" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#ffffff', padding: '0.85rem 1.75rem' }}>
              View System Status
            </a>
          </div>
        </div>
      </section>

      {/* 2. LIVE SYSTEM & API HEALTH STATUS */}
      <section id="system-status" style={{ marginBottom: '3.5rem' }}>
        <div className="card" style={{ borderLeft: '5px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '0.25rem' }}>🔌 Backend & Database Diagnostics</h2>
              <p style={{ color: 'var(--color-muted-text)', fontSize: '0.9rem' }}>Real-time health check communicating with Express & MongoDB</p>
            </div>
            <span className={`status-pill ${apiStatus.online ? 'status-online' : 'status-offline'}`}>
              <span className="status-indicator-dot"></span>
              {apiStatus.loading ? 'Checking...' : apiStatus.online ? 'Backend Connected' : 'Server Offline / Disconnected'}
            </span>
          </div>

          <div style={{ background: 'var(--color-muted)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontFamily: 'monospace' }}>
            <div><strong>Endpoint:</strong> GET http://localhost:5000/api/health/db</div>
            <div style={{ marginTop: '0.5rem' }}>
              <strong>Response:</strong> {JSON.stringify(apiStatus.data, null, 2)}
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURE & ARCHITECTURE GRID */}
      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', textAlign: 'center' }}>Key Architecture Highlights</h2>
        <p style={{ color: 'var(--color-muted-text)', textAlign: 'center', marginBottom: '2rem' }}>
          Designed with industry-standard MERN separation of concerns
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚛️</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>React 19 + Vite</h3>
            <p style={{ color: 'var(--color-muted-text)', fontSize: '0.9rem' }}>
              Instant HMR development workflow, lightweight component tree, and dynamic routing with React Router.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🚂</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Express & Node.js</h3>
            <p style={{ color: 'var(--color-muted-text)', fontSize: '0.9rem' }}>
              REST API design, modular controller/route architecture, and CORS-enabled security.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🍃</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>MongoDB & Mongoose</h3>
            <p style={{ color: 'var(--color-muted-text)', fontSize: '0.9rem' }}>
              Schema-based document data persistence with robust connection pooling and validation models.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎨</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Design System Tokens</h3>
            <p style={{ color: 'var(--color-muted-text)', fontSize: '0.9rem' }}>
              `ui-ux-pro-max` curated emerald & vibrant amber palette with Rubik & Nunito Sans typography.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section style={{ textAlign: 'center', background: 'var(--color-muted)', padding: '3rem 1.5rem', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Ready to Explore Nexoria?</h2>
        <p style={{ color: 'var(--color-muted-text)', marginBottom: '1.5rem' }}>
          Check out the product catalog skeleton and test navigation flows.
        </p>
        <Link to="/products" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
          Browse All Products
        </Link>
      </section>
    </div>
  );
}
