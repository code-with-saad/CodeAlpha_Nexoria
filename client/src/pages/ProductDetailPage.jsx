import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ProductDetailPage() {
  const { id } = useParams();

  return (
    <div className="product-detail-page">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/products" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
          ← Back to All Products
        </Link>
      </div>

      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', padding: '2.5rem' }}>
        <div style={{ 
          height: '320px', 
          background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)', 
          borderRadius: 'var(--radius-md)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '5rem'
        }}>
          📦
        </div>

        <div>
          <span className="brand-badge" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>Featured Item</span>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Product ID #{id}</h1>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem' }}>
            $149.99
          </p>
          <p style={{ color: 'var(--color-muted-text)', lineHeight: '1.7', marginBottom: '2rem' }}>
            This is a placeholder product detail skeleton for Item #{id}. In Phase 3, this component will fetch dynamic product details directly from the MongoDB backend via Express API.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-accent" style={{ padding: '0.75rem 1.75rem' }}>
              🛒 Add to Cart
            </button>
            <button className="btn btn-outline" style={{ padding: '0.75rem 1.5rem' }}>
              🤍 Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
