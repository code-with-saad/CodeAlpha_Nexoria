import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Package, Star, ShoppingBag } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [wished, setWished] = useState(() => {
    try {
      const wl = JSON.parse(localStorage.getItem('nexoria_wishlist') || '[]');
      return wl.includes(id);
    } catch { return false; }
  });

  const toast = useToast();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/products/' + id);
        if (response.data?.data) {
          const current = response.data.data;
          setProduct(current);

          // Fetch related products
          if (current.category) {
            setLoadingRelated(true);
            try {
              const relRes = await api.get('/products', {
                params: { category: current.category, limit: 5 }
              });
              if (relRes.data?.data) {
                const filtered = relRes.data.data.filter(p => p._id !== id).slice(0, 4);
                setRelatedProducts(filtered);
              }
            } catch {
              setRelatedProducts([]);
            } finally {
              setLoadingRelated(false);
            }
          }
        }
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Product not found';
        setError(msg);
        toast.error(msg, { title: 'Product Error' });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (delta) => {
    setQuantity(prev => {
      const maxStock = product?.stock || 99;
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > maxStock) return maxStock;
      return next;
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  const toggleWishlist = () => {
    const wl = JSON.parse(localStorage.getItem('nexoria_wishlist') || '[]');
    const next = wl.includes(id) ? wl.filter(x => x !== id) : [...wl, id];
    localStorage.setItem('nexoria_wishlist', JSON.stringify(next));
    setWished(!wished);
    toast.info(wished ? 'Removed from wishlist' : 'Added to wishlist', { title: 'Wishlist' });
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="skeleton" style={{ height: '20px', width: '150px' }} />
        </div>
        <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', padding: '2.5rem' }}>
          <div className="skeleton" style={{ height: '380px', width: '100%' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="skeleton" style={{ height: '24px', width: '30%' }} />
            <div className="skeleton" style={{ height: '36px', width: '80%' }} />
            <div className="skeleton" style={{ height: '28px', width: '25%' }} />
            <div className="skeleton" style={{ height: '80px', width: '100%' }} />
            <div className="skeleton" style={{ height: '48px', width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <Package size={72} style={{ color: 'var(--color-muted-text)', margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Product Not Found</h2>
        <p style={{ color: 'var(--color-muted-text)', marginBottom: '2rem' }}>
          {error || 'The requested product could not be located in our catalog.'}
        </p>
        <Link to="/products" className="btn btn-primary">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="product-detail-page">
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', paddingLeft: 0, color: 'var(--color-primary)', fontWeight: 700 }}
        >
          <ArrowLeft size={17} />
          Back
        </button>
      </div>

      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', padding: '2.5rem', marginBottom: '4rem' }}>

        {/* PRODUCT IMAGE */}
        <div style={{ minHeight: '380px', background: 'var(--color-muted)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
          {product.image?.startsWith('http') ? (
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <div style={{ display: product.image?.startsWith('http') ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Package size={80} color="var(--color-muted-text)" />
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>

          {/* Eyebrow label */}
          <span className="eyebrow-badge" style={{ marginBottom: '0.75rem' }}>
            Shop The Collection
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span className="brand-badge">{product.category}</span>
            <span className={'status-pill ' + (isOutOfStock ? 'status-offline' : 'status-online')} style={{ fontSize: '0.75rem' }}>
              <span className="status-indicator-dot" />
              {isOutOfStock ? 'Out of Stock' : 'In Stock (' + product.stock + ' available)'}
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '0.75rem',
            letterSpacing: '-0.01em'
          }}>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem' }}>
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={16} fill={s <= 4 ? '#f59e0b' : 'none'} stroke='#f59e0b' />
            ))}
            <span style={{ color: 'var(--color-muted-text)', fontSize: '0.85rem', marginLeft: '0.25rem' }}>4.8 rating</span>
          </div>

          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
            ${Number(product.price || 0).toFixed(2)}
          </div>

          <p style={{ color: 'var(--color-muted-text)', lineHeight: '1.7', marginBottom: '2rem', flex: 1 }}>
            {product.description}
          </p>

          {/* QUANTITY */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Quantity:</label>
            <div className="quantity-counter">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || isOutOfStock}
                className="quantity-btn"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="quantity-value">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock || isOutOfStock}
                className="quantity-btn"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* ACTIONS */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleAddToCart}
              className="btn btn-accent"
              style={{ padding: '0.85rem 2rem', fontSize: '1rem', flex: 1 }}
              disabled={isOutOfStock}
            >
              <ShoppingCart size={19} />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
              onClick={toggleWishlist}
              className="btn btn-outline"
              style={{ padding: '0.85rem 1.25rem' }}
              title={wished ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart size={19} fill={wished ? '#ef4444' : 'none'} stroke={wished ? '#ef4444' : 'currentColor'} />
            </button>
            <Link to="/products" className="btn btn-outline" style={{ padding: '0.85rem 1.25rem' }}>
              <ShoppingBag size={17} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS SECTION */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: '2rem' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.35rem' }}>Related Products</h2>
            <p style={{ color: 'var(--color-muted-text)', fontSize: '0.95rem' }}>
              More from the <strong>{product.category}</strong> category
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rel => (
              <div
                key={rel._id}
                className="card product-card"
                style={{ cursor: 'pointer', position: 'relative' }}
                onClick={() => {
                  navigate(`/products/${rel._id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="product-image-container" style={{ marginBottom: '1rem' }}>
                  {rel.image?.startsWith('http') ? (
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="product-image"
                      loading="lazy"
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <div style={{ display: rel.image?.startsWith('http') ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Package size={56} color="var(--color-muted-text)" />
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
                  {rel.category}
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.45rem', lineHeight: 1.35 }}>
                  {rel.name}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '1px solid var(--color-border)', marginTop: 'auto' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                    ${Number(rel.price || 0).toFixed(2)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(rel, 1);
                    }}
                    className="btn btn-accent"
                    style={{ padding: '0.45rem 0.9rem', fontSize: '0.83rem', gap: '0.4rem' }}
                    disabled={rel.stock <= 0}
                  >
                    <ShoppingCart size={14} />
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
