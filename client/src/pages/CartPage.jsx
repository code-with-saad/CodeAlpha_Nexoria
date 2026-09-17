import React from 'react';
import { Link } from 'react-router-dom';

export default function CartPage() {
  return (
    <div className="cart-page">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Shopping Cart</h1>
        <p style={{ color: 'var(--color-muted-text)' }}>
          Review your items and proceed to checkout (Phase 3 & Phase 4 Integration).
        </p>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛒</div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Your Cart is Currently Empty</h2>
        <p style={{ color: 'var(--color-muted-text)', maxWidth: '450px', margin: '0 auto 2rem' }}>
          Explore our trending collections and add items to your cart to begin your order.
        </p>
        <Link to="/products" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    </div>
  );
}
