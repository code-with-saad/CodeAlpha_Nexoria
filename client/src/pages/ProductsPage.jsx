import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['All', 'Electronics', 'Accessories', 'Lifestyle', 'Home'];

const FALLBACK_PRODUCTS = [
  {
    _id: 'mock-1',
    name: 'Nexoria Pro Wireless ANC Headphones',
    description: 'Ultra-low latency Bluetooth 5.3 headphones with active noise cancellation and 40h battery life.',
    price: 149.99,
    category: 'Electronics',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'
  },
  {
    _id: 'mock-2',
    name: 'Ergonomic Split Mechanical Keyboard',
    description: 'Custom hot-swappable RGB mechanical keyboard designed for maximum typing posture comfort.',
    price: 119.50,
    category: 'Accessories',
    stock: 14,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80'
  },
  {
    _id: 'mock-3',
    name: 'Minimalist Chronograph Wristwatch',
    description: 'Precision Japanese quartz movement with surgical-grade 316L stainless steel casing and sapphire crystal.',
    price: 189.00,
    category: 'Lifestyle',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'
  },
  {
    _id: 'mock-4',
    name: 'Smart Ambient LED Studio Lamp',
    description: 'Dimmable color-temperature desk lamp with app control, wireless charging base, and eye-care diffuser.',
    price: 59.99,
    category: 'Home',
    stock: 19,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80'
  }
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const toast = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;

      const response = await api.get('/products', { params });
      if (response.data?.data) {
        if (response.data.data.length === 0 && !search.trim() && category === 'All') {
          // Backend is online but database has no products yet; offer preview catalog
          setProducts(FALLBACK_PRODUCTS);
          setIsUsingFallback(true);
        } else {
          setProducts(response.data.data);
          setIsUsingFallback(false);
        }
      }
    } catch (error) {
      console.warn('Could not reach backend product API; showing preview catalog:', error.message);
      // Filter fallback products locally so user experience remains rich
      let filtered = FALLBACK_PRODUCTS;
      if (category !== 'All') {
        filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        );
      }
      setProducts(filtered);
      setIsUsingFallback(true);
      toast.warning('Displaying preview catalog while connecting to MongoDB server.', {
        title: 'Catalog Preview Mode'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [search, category]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat);
  };

  return (
    <div className="products-page">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Explore Products</h1>
        <p style={{ color: 'var(--color-muted-text)' }}>
          Discover our curated collection of verified premium goods.
        </p>
      </div>

      {isUsingFallback && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>💡</span>
          <span>
            Showing demonstration catalog. Products created via backend will automatically appear here.
          </span>
        </div>
      )}

      {/* FILTER & SEARCH CONTROLS */}
      <div className="filters-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-input"
            placeholder="Search products by title or keywords..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${category === cat ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS DISPLAY */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton skeleton-img" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text-sm" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No products found</h3>
          <p style={{ color: 'var(--color-muted-text)', marginBottom: '1.5rem' }}>
            No items matched your current filter criteria "{search || category}".
          </p>
          <button
            className="btn btn-outline"
            onClick={() => {
              setSearch('');
              setCategory('All');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
          {products.map((prod) => (
            <div key={prod._id} className="card product-card">
              <div className="product-image-container">
                {prod.image?.startsWith('http') ? (
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="product-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  style={{
                    display: prod.image?.startsWith('http') ? 'none' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3.5rem',
                    height: '100%',
                    width: '100%'
                  }}
                >
                  📦
                </div>
              </div>

              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-primary)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '0.35rem'
                }}
              >
                {prod.category}
              </div>

              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', flex: 1 }}>
                <Link
                  to={`/products/${prod._id}`}
                  style={{ transition: 'color 0.2s', color: 'var(--color-foreground)' }}
                >
                  {prod.name}
                </Link>
              </h3>

              <p
                style={{
                  color: 'var(--color-muted-text)',
                  fontSize: '0.85rem',
                  lineHeight: '1.4',
                  marginBottom: '1rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {prod.description}
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'auto',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--color-border)'
                }}
              >
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
                  ${Number(prod.price).toFixed(2)}
                </span>
                <Link
                  to={`/products/${prod._id}`}
                  className="btn btn-outline"
                  style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
