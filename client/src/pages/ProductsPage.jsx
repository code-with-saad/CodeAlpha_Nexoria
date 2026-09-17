import React from 'react';
import { Link } from 'react-router-dom';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Nexoria Pro Wireless Headphones', price: 149.99, category: 'Electronics', rating: 4.8, inStock: true },
  { id: '2', name: 'Ultra-Comfort Ergonomic Keyboard', price: 89.50, category: 'Accessories', rating: 4.7, inStock: true },
  { id: '3', name: 'Minimalist Stainless Steel Watch', price: 199.00, category: 'Lifestyle', rating: 4.9, inStock: true },
  { id: '4', name: 'Smart Ambient Desk Lamp', price: 45.00, category: 'Home', rating: 4.6, inStock: false },
];

export default function ProductsPage() {
  return (
    <div className="products-page">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Product Catalog</h1>
        <p style={{ color: 'var(--color-muted-text)' }}>
          Browse our curated selection of high-quality products (Ready for Phase 3 API Integration).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
        {MOCK_PRODUCTS.map((prod) => (
          <div key={prod.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              height: '180px', 
              background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)', 
              borderRadius: 'var(--radius-md)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>
              📦
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              {prod.category}
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', flex: 1 }}>
              <Link to={`/products/${prod.id}`} style={{ transition: 'color 0.2s' }}>
                {prod.name}
              </Link>
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
              <div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
                  ${prod.price.toFixed(2)}
                </span>
              </div>
              <Link to={`/products/${prod.id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
