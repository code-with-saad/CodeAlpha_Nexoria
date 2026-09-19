import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, ShoppingCart, Star, Package, Zap, Heart,
  Smartphone, Headphones, Sparkles, Home as HomeIcon,
  ShieldCheck, Truck, RotateCcw, Award, Check
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const CATEGORY_DATA = [
  { name: 'Electronics', Icon: Smartphone, color: '#3b82f6', bgClass: 'cat-card-electronics', desc: 'Cutting-edge tech & gadgets' },
  { name: 'Accessories', Icon: Headphones, color: '#8b5cf6', bgClass: 'cat-card-accessories', desc: 'Elevate your everyday setup' },
  { name: 'Lifestyle', Icon: Sparkles, color: '#f36416', bgClass: 'cat-card-lifestyle', desc: 'Refined goods for modern life' },
  { name: 'Home', Icon: HomeIcon, color: '#10b981', bgClass: 'cat-card-home', desc: 'Smart living essentials' }
];

function CountUp({ end = 12500, duration = 1800, suffix = '+' }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime = null;

          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            // Ease out quad
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            setCount(Math.floor(easeProgress * end));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={elementRef}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nexoria_wishlist') || '[]'); } catch { return []; }
  });
  const { addToCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products', { params: { limit: 4 } });
        if (data?.data) setFeatured(data.data.slice(0, 4));
      } catch { /* silently fail — hero CTA still works */ }
      finally { setLoadingFeatured(false); }
    };
    fetchFeatured();
  }, []);

  const toggleWishlist = (e, prodId) => {
    e.stopPropagation();
    const isWished = wishlist.includes(prodId);
    const next = isWished ? wishlist.filter(id => id !== prodId) : [...wishlist, prodId];
    setWishlist(next);
    localStorage.setItem('nexoria_wishlist', JSON.stringify(next));
    toast.info(isWished ? 'Removed from wishlist' : 'Added to wishlist', { title: 'Wishlist' });
  };

  const handleAddToCart = (e, prod) => {
    e.stopPropagation();
    addToCart(prod, 1);
  };

  return (
    <div className="home-page">

      {/* ── ASYMMETRIC TWO-COLUMN HERO ──────────────────────────── */}
      <section className="hero-asymmetric">
        <div className="hero-content">
          <div className="hero-pill">
            <Zap size={14} fill="var(--color-accent)" stroke="var(--color-accent)" />
            Curated 2026 Collection &bull; Free Worldwide Shipping over $50
          </div>
          <h1 className="hero-title">
            Exceptional Design.<br />
            <span className="hero-title-accent">Modern Performance.</span>
          </h1>
          <p className="hero-subtitle">
            Nexoria delivers meticulously crafted electronics, accessories, lifestyle gear, and smart home essentials designed to elevate your everyday standard.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-accent" style={{ fontSize: '1.05rem', padding: '0.9rem 2.2rem' }}>
              Explore Collection
              <ArrowRight size={18} />
            </Link>
            <Link to="/products" className="btn btn-outline hero-outline-btn" style={{ padding: '0.9rem 1.85rem' }}>
              View Catalog
            </Link>
          </div>
        </div>

        {/* Right column: Tilted layer stack with real seeded products */}
        <div className="hero-visual-stack">
          {/* Card 1: Top Left - Backpack */}
          <Link
            to={featured[0] ? `/products/${featured[0]._id}` : '/products'}
            className="hero-card-layer hero-card-layer-1"
          >
            <img
              src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"
              alt="Hardshell Travel Backpack"
              className="hero-layer-img"
            />
            <div className="hero-layer-info">
              <span className="hero-layer-title">Travel Backpack</span>
              <span className="hero-layer-price">$148.00</span>
            </div>
          </Link>

          {/* Card 2: Bottom Right - Cardholder */}
          <Link
            to={featured[2] ? `/products/${featured[2]._id}` : '/products'}
            className="hero-card-layer hero-card-layer-2"
          >
            <img
              src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80"
              alt="Slim Cardholder Wallet"
              className="hero-layer-img"
            />
            <div className="hero-layer-info">
              <span className="hero-layer-title">Slim Cardholder</span>
              <span className="hero-layer-price">$42.00</span>
            </div>
          </Link>

          {/* Card Main: Center - Minimalist Watch */}
          <Link
            to={featured[1] ? `/products/${featured[1]._id}` : '/products'}
            className="hero-card-layer hero-card-layer-main"
          >
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
              alt="Minimalist Chronograph Watch"
              className="hero-layer-img"
            />
            <div className="hero-layer-info">
              <span className="hero-layer-title">Minimalist Chronograph</span>
              <span className="hero-layer-price">$189.00</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── SOCIAL PROOF / TRUST SIGNALS BAR ────────────────────── */}
      <section className="trust-bar" aria-label="Store Benefits & Guarantees">
        <div className="trust-item">
          <div className="trust-icon-box">
            <Truck size={22} />
          </div>
          <div>
            <div className="trust-title">Free Express Shipping</div>
            <p className="trust-desc">Fast, tracked delivery on orders over $50</p>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon-box">
            <Award size={22} />
          </div>
          <div>
            <div className="trust-title">4.9 / 5 Rating</div>
            <p className="trust-desc">Backed by 12,500+ verified customer reviews</p>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon-box">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="trust-title">Secure Stripe Checkout</div>
            <p className="trust-desc">256-bit encryption for all card payments</p>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon-box">
            <RotateCcw size={22} />
          </div>
          <div>
            <div className="trust-title">30-Day Easy Returns</div>
            <p className="trust-desc">Hassle-free refunds &amp; friendly support</p>
          </div>
        </div>
      </section>

      {/* ── CATEGORY SHOWCASE ───────────────────────────────────── */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>Shop by Category</h2>
          <p style={{ color: 'var(--color-muted-text)' }}>Find exactly what you need in our curated sections</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {CATEGORY_DATA.map(({ name, Icon, color, desc }) => (
            <Link
              key={name}
              to={`/products?category=${name}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="category-showcase-card"
                style={{
                  textAlign: 'center',
                  padding: '2.25rem 1.5rem',
                  cursor: 'pointer'
                }}
              >
                <div
                  className="category-icon-wrapper"
                  style={{
                    width: '64px',
                    height: '64px',
                    margin: '0 auto 1rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={32} color={color} strokeWidth={2.2} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--color-foreground)', fontWeight: 700 }}>
                  {name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)', margin: 0 }}>
                  {desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ───────────────────────────────────── */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Featured Products</h2>
            <p style={{ color: 'var(--color-muted-text)', fontSize: '0.95rem' }}>Top picks from our latest collection</p>
          </div>
          <Link to="/products" className="btn btn-outline" style={{ gap: '0.4rem' }}>
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loadingFeatured ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton-img" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingTop: '0.5rem' }}>
                  <div className="skeleton skeleton-text" />
                  <div className="skeleton skeleton-text-sm" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
            {featured.map(prod => (
              <div
                key={prod._id}
                className="card product-card"
                style={{ cursor: 'pointer', position: 'relative' }}
                onClick={() => navigate('/products/' + prod._id)}
              >
                {/* Wishlist */}
                <button
                  onClick={e => toggleWishlist(e, prod._id)}
                  style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2, background: 'rgba(255,255,255,0.9)', border: '1px solid var(--color-border)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  title="Wishlist"
                >
                  <Heart size={17} fill={wishlist.includes(prod._id) ? '#ef4444' : 'none'} stroke={wishlist.includes(prod._id) ? '#ef4444' : 'var(--color-muted-text)'} />
                </button>

                <div className="product-image-container">
                  {prod.image?.startsWith('http') ? (
                    <img src={prod.image} alt={prod.name} className="product-image" loading="lazy" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                  ) : null}
                  <div style={{ display: prod.image?.startsWith('http') ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Package size={56} color="var(--color-muted-text)" />
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
                  {prod.category}
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.45rem' }}>{prod.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s<=4?'#f59e0b':'none'} stroke='#f59e0b' />)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '1px solid var(--color-border)', marginTop: 'auto' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                    ${Number(prod.price || 0).toFixed(2)}
                  </span>
                  <button
                    onClick={e => handleAddToCart(e, prod)}
                    className="btn btn-accent"
                    style={{ padding: '0.45rem 0.9rem', fontSize: '0.83rem' }}
                    disabled={prod.stock <= 0}
                  >
                    <ShoppingCart size={14} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── DISTINCT SPLIT CTA BANNER ───────────────────────────── */}
      <section className="cta-split-banner">
        <div>
          <h2 className="cta-banner-heading">
            Upgrade Your Everyday Setup with Nexoria
          </h2>
          <p className="cta-banner-desc">
            Experience seamless checkout, premium build quality, and direct buyer protection on every item.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div className="cta-banner-check-row">
              <Check size={16} className="cta-banner-check-icon" /> 30-Day Risk-Free Trial &amp; Free Returns
            </div>
            <div className="cta-banner-check-row">
              <Check size={16} className="cta-banner-check-icon" /> Real-time order tracking &amp; Instant dispatch
            </div>
          </div>
        </div>

        <div className="cta-stat-card">
          <div className="cta-stat-num">
            <CountUp end={12500} suffix="+" />
          </div>
          <div className="cta-stat-label">Orders safely delivered worldwide</div>
          <Link
            to="/products"
            className="btn btn-accent"
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
          >
            Start Shopping <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}
