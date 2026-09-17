import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const FALLBACK_PRODUCTS_MAP = {
  'mock-1': {
    _id: 'mock-1',
    name: 'Nexoria Pro Wireless ANC Headphones',
    description:
      'Engineered with 40mm dynamic bio-cellulose drivers, hybrid active noise cancellation (ANC), transparency mode, and ultra-plush memory foam earcups for all-day comfort. Features Bluetooth 5.3 multi-point connectivity and up to 40 hours of playback.',
    price: 149.99,
    category: 'Electronics',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
  },
  'mock-2': {
    _id: 'mock-2',
    name: 'Ergonomic Split Mechanical Keyboard',
    description:
      'Gasket-mounted hot-swappable mechanical keyboard with lubricated linear switches, per-key RGB backlighting, custom OLED display screen, and an integrated padded magnetic wrist rest.',
    price: 119.50,
    category: 'Accessories',
    stock: 14,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'
  },
  'mock-3': {
    _id: 'mock-3',
    name: 'Minimalist Chronograph Wristwatch',
    description:
      'Crafted with surgical-grade 316L stainless steel, anti-reflective sapphire crystal glass, 5 ATM water resistance, and an interchangeable full-grain Italian leather strap.',
    price: 189.00,
    category: 'Lifestyle',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
  },
  'mock-4': {
    _id: 'mock-4',
    name: 'Smart Ambient LED Studio Lamp',
    description:
      'Smart desk companion with 16 million colors, stepless color temperature adjustment (2700K - 6500K), Qi fast wireless charging pad at the base, and native smart home voice integration.',
    price: 59.99,
    category: 'Home',
    stock: 19,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80'
  }
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  const toast = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/products/${id}`);
        if (response.data?.data) {
          setProduct(response.data.data);
        }
      } catch (err) {
        // Check fallback map
        if (FALLBACK_PRODUCTS_MAP[id]) {
          setProduct(FALLBACK_PRODUCTS_MAP[id]);
        } else {
          setError(err.message || 'Product not found');
          toast.error(err.message || 'Could not load product details', {
            title: 'Product Error'
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const maxStock = product?.stock || 99;
      const nextVal = prev + delta;
      if (nextVal < 1) return 1;
      if (nextVal > maxStock) return maxStock;
      return nextVal;
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    toast.success(
      `Added ${quantity} × ${product.name} to cart! (Full cart persistence active in Phase 3)`,
      { title: 'Added to Cart' }
    );
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="skeleton" style={{ height: '20px', width: '150px' }} />
        </div>
        <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', padding: '2.5rem' }}>
          <div className="skeleton" style={{ height: '340px', width: '100%' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="skeleton" style={{ height: '24px', width: '30%' }} />
            <div className="skeleton" style={{ height: '36px', width: '80%' }} />
            <div className="skeleton" style={{ height: '28px', width: '25%' }} />
            <div className="skeleton" style={{ height: '80px', width: '100%' }} />
            <div className="skeleton" style={{ height: '48px', width: '50%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Product Not Found</h2>
        <p style={{ color: 'var(--color-muted-text)', marginBottom: '2rem' }}>
          {error || 'The requested product could not be located in our catalog.'}
        </p>
        <Link to="/products" className="btn btn-primary">
          ← Back to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="product-detail-page">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/products"
          style={{
            color: 'var(--color-primary)',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          ← Back to All Products
        </Link>
      </div>

      <div
        className="card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          padding: '2.5rem'
        }}
      >
        {/* PRODUCT IMAGE CONTAINER */}
        <div
          style={{
            minHeight: '340px',
            background: '#f1f5f9',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {product.image?.startsWith('http') ? (
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            style={{
              display: product.image?.startsWith('http') ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '5rem',
              height: '100%',
              width: '100%'
            }}
          >
            📦
          </div>
        </div>

        {/* PRODUCT SPECS & PURCHASE ACTION */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span className="brand-badge">{product.category}</span>
            <span
              className={`status-pill ${isOutOfStock ? 'status-offline' : 'status-online'}`}
              style={{ fontSize: '0.75rem' }}
            >
              <span className="status-indicator-dot" />
              {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} available)`}
            </span>
          </div>

          <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--color-foreground)' }}>
            {product.name}
          </h1>

          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
            ${Number(product.price).toFixed(2)}
          </div>

          <p style={{ color: 'var(--color-muted-text)', lineHeight: '1.7', marginBottom: '2rem' }}>
            {product.description}
          </p>

          {/* QUANTITY SELECTOR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>
              Quantity:
            </label>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden'
              }}
            >
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || isOutOfStock}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--color-muted)',
                  fontSize: '1.1rem',
                  fontWeight: 700
                }}
              >
                −
              </button>
              <span
                style={{
                  padding: '0.5rem 1.25rem',
                  fontWeight: 700,
                  fontSize: '1rem',
                  minWidth: '2.5rem',
                  textAlign: 'center'
                }}
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock || isOutOfStock}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--color-muted)',
                  fontSize: '1.1rem',
                  fontWeight: 700
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* ADD TO CART ACTION */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleAddToCart}
              className="btn btn-accent"
              style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
              disabled={isOutOfStock}
            >
              🛒 {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <Link
              to="/products"
              className="btn btn-outline"
              style={{ padding: '0.85rem 1.5rem' }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
