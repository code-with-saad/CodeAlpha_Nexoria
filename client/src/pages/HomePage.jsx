import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Star, Package, Zap, Heart } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const CATEGORY_DATA = [
  { name: 'Electronics', emoji: '⚡', color: '#3b82f6', bg: '#eff6ff', desc: 'Cutting-edge tech & gadgets' },
  { name: 'Accessories', emoji: '🎧', color: '#8b5cf6', bg: '#f5f3ff', desc: 'Elevate your everyday setup' },
  { name: 'Lifestyle', emoji: '✨', color: '#ea580c', bg: '#fff7ed', desc: 'Refined goods for modern life' },
  { name: 'Home', emoji: '🏡', color: '#059669', bg: '#ecfdf5', desc: 'Smart living essentials' }
];

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
    setWishlist(prev => {
      const next = prev.includes(prodId) ? prev.filter(id => id !== prodId) : [...prev, prodId];
      localStorage.setItem('nexoria_wishlist', JSON.stringify(next));
      toast.info(prev.includes(prodId) ? 'Removed from wishlist' : 'Added to wishlist', { title: 'Wishlist' });
      return next;
    });
  };

  const handleAddToCart = (e, prod) => {
    e.stopPropagation();
    addToCart(prod, 1);
    toast.success(prod.name + ' added to cart!', { title: 'Cart Updated' });
  };

  return (
    <div className="home-page">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 45%, #0f766e 100%)',
        color: '#ffffff',
        padding: '5rem 0',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '4rem',
        boxShadow: 'var(--shadow-glow)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-40px', right: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(52,211,153,0.12)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-40px', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(251,191,36,0.1)', filter: 'blur(50px)' }} />

        <div className="container" style={{ textAlign: 'center', maxWidth: '800px', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)', padding: '0.4rem 1.1rem', borderRadius: 'var(--radius-full)', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)' }}>
            <Zap size={14} fill="#fbbf24" stroke="#fbbf24" />
            Free shipping on orders over 
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', color: '#ffffff', marginBottom: '1.25rem', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Elevate Your World<br/>with <span style={{ color: '#6ee7b7' }}>Nexoria</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#a7f3d0', lineHeight: '1.65', marginBottom: '2.25rem', maxWidth: '600px', margin: '0 auto 2.25rem' }}>
            Curated premium goods across electronics, accessories, lifestyle &amp; home — hand-picked for modern living.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-accent" style={{ fontSize: '1.05rem', padding: '0.9rem 2.2rem' }}>
              Shop Now
              <ArrowRight size={18} />
            </Link>
            <Link to="/products" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#ffffff', padding: '0.9rem 1.85rem' }}>
              Browse Categories
            </Link>
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
          {CATEGORY_DATA.map(cat => (
            <Link
              key={cat.name}
              to={'/products?category=' + cat.name}
              onClick={() => navigate('/products')}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="card"
                style={{
                  background: cat.bg, borderColor: cat.color + '30',
                  textAlign: 'center', padding: '2rem 1.5rem',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px ' + cat.color + '22'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{cat.emoji}</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: cat.color }}>{cat.name}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{cat.desc}</p>
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
                  <span style={{ fontSize: '1.25rem', fontWeight: 800 }}></span>
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

      {/* ── CTA BANNER ──────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, #9a3412 100%)', padding: '3.5rem 2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: '1.85rem', marginBottom: '0.75rem', color: '#fff' }}>Ready to Shop Nexoria?</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '1.75rem', fontSize: '1.05rem' }}>
          Join thousands of happy customers and discover your next favourite product.
        </p>
        <Link to="/products" className="btn" style={{ background: '#fff', color: 'var(--color-accent)', fontWeight: 800, padding: '0.9rem 2.2rem', fontSize: '1rem' }}>
          Browse All Products <ArrowRight size={17} />
        </Link>
      </section>
    </div>
  );
}
