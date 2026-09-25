import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, ShoppingCart, Star, Package, Zap, Heart,
  Smartphone, Headphones, Sparkles, Home as HomeIcon,
  ShieldCheck, Truck, RotateCcw, Award, Check
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

const CATEGORY_DATA = [
  { name: 'Electronics', Icon: Smartphone, color: '#996515', bgClass: 'cat-card-electronics', desc: 'Cutting-edge tech & gadgets' },
  { name: 'Accessories', Icon: Headphones, color: '#d84315', bgClass: 'cat-card-accessories', desc: 'Elevate your everyday setup' },
  { name: 'Lifestyle', Icon: Sparkles, color: '#c25e00', bgClass: 'cat-card-lifestyle', desc: 'Refined goods for modern life' },
  { name: 'Home', Icon: HomeIcon, color: '#7e520f', bgClass: 'cat-card-home', desc: 'Smart living essentials' }
];

/* ── Marquee strip content ──────────────────────────────── */
const MARQUEE_ITEMS = [
  'New Arrivals', 'Free Shipping', 'Curated Quality',
  'Limited Stock', 'Nexoria', 'Premium Goods', 'Fast Dispatch',
  'Verified Products', 'New Arrivals', 'Free Shipping', 'Curated Quality',
  'Limited Stock', 'Nexoria', 'Premium Goods', 'Fast Dispatch',
  'Verified Products',
];

function MarqueeStrip() {
  return (
    <div className="marquee-strip" aria-hidden="true">
      <div className="marquee-track">
        {MARQUEE_ITEMS.map((item, i) => (
          <span key={i} className="marquee-item">
            {item}
            <span className="marquee-dot">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── CountUp animated number ─────────────────────────────── */
function CountUp({ end = 12500, duration = 1800, suffix = '+' }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime = null;

          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            setCount(Math.floor(easeProgress * end));
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(end);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return <span ref={elementRef}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Main HomePage component ─────────────────────────────── */
export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [flagshipProduct, setFlagshipProduct] = useState(null);
  const [totalProductsCount, setTotalProductsCount] = useState(24);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nexoria_wishlist') || '[]'); } catch { return []; }
  });

  const { addToCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  /* Scroll-reveal root is the whole page body content */
  const pageRef = useRef(null);
  useScrollReveal(pageRef, { deps: [featured, flagshipProduct] });

  useEffect(() => {
    const fetchCatalogData = async () => {
      try {
        const { data } = await api.get('/products', { params: { limit: 20 } });
        if (data?.data) {
          const allProds = data.data;
          setTotalProductsCount(data.total || allProds.length);
          const flagship = allProds.find(p => p.isFeatured) || allProds[0];
          setFlagshipProduct(flagship);
          setFeatured(allProds.slice(0, 4));
        }
      } catch {
        /* fallback handled gracefully */
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchCatalogData();
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
    <div className="home-page" ref={pageRef}>

      {/* ── FLAGSHIP EDITORIAL HERO - THEME-AWARE & FULL BLEED ────── */}
      <section className="flagship-hero" aria-label="Flagship Product Showcase">
        <div className="flagship-hero-inner">
          <div className="flagship-hero-grid">
            {/* Left Column: Headlines & Actions */}
            <div>
              {/* Eyebrow badge */}
              <span className="eyebrow-badge reveal" data-delay="0">
                FLAGSHIP &middot; NEW ARRIVAL
              </span>

              {/* Two-line Signature Bold Headline with Stroke Text */}
              <h1 className="flagship-headline-solid reveal" data-delay="80">
                Meet The Piece
              </h1>
              <div className="flagship-headline-stroke reveal" data-delay="160">
                We Built Nexoria Around
              </div>

              {/* Short Supporting Paragraph */}
              <p className="flagship-subtext reveal" data-delay="240">
                {flagshipProduct ? (
                  <>The <strong>{flagshipProduct.name}</strong>. Precision movement, sapphire crystal, a design that started the whole collection.</>
                ) : (
                  'The aurora chronograph. Precision movement, sapphire crystal, a design that started the whole collection.'
                )}
              </p>

              {/* CTAs */}
              <div className="flagship-actions reveal" data-delay="320">
                <Link
                  to={flagshipProduct ? `/products/${flagshipProduct._id}` : '/products'}
                  className="btn btn-primary"
                  style={{ fontSize: '0.95rem', padding: '0.75rem 1.6rem' }}
                >
                  Shop This Piece
                </Link>
                <Link
                  to="/products"
                  className="btn flagship-outline-btn"
                  style={{ fontSize: '0.95rem', padding: '0.75rem 1.6rem' }}
                >
                  Full Collection
                </Link>
              </div>

              {/* Inline Flagship Product Card Inside Hero */}
              {flagshipProduct && (
                <Link
                  to={`/products/${flagshipProduct._id}`}
                  className="flagship-card reveal"
                  data-delay="400"
                >
                  <div className="flagship-thumb-box">
                    {flagshipProduct.image?.startsWith('http') ? (
                      <img
                        src={flagshipProduct.image}
                        alt={flagshipProduct.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div style={{ display: flagshipProduct.image?.startsWith('http') ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={24} color="var(--color-primary)" />
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flagship-card-title">{flagshipProduct.name}</div>
                    <div className="flagship-card-meta">4.9 rating &middot; 300+ sold</div>
                  </div>

                  <div className="flagship-card-price">
                    ${Number(flagshipProduct.price || 0).toFixed(2)}
                  </div>
                </Link>
              )}
            </div>

            {/* Right Column: Visual Element with subtle rotation and framing */}
            <div className="flagship-hero-visual reveal" data-delay="200">
              <div className="flagship-hero-visual-frame">
                {flagshipProduct?.image?.startsWith('http') ? (
                  <img
                    src={flagshipProduct.image}
                    alt={flagshipProduct.name}
                    className="flagship-hero-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--color-primary)' }}>
                    <Package size={72} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-muted-text)' }}>Nexoria Flagship</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dedicated Styled Stats Strip - Theme-Aware */}
          <div className="flagship-stats-strip reveal" data-delay="450">
            <div className="flagship-stat-col">
              <div className="flagship-stat-number"><CountUp end={12500} suffix="+" /></div>
              <div className="flagship-stat-label">orders delivered</div>
            </div>
            <div className="flagship-stat-col">
              <div className="flagship-stat-number"><CountUp end={99} duration={1200} suffix="%" /></div>
              <div className="flagship-stat-label">satisfaction rate</div>
            </div>
            <div className="flagship-stat-col">
              <div className="flagship-stat-number">4.9 / 5</div>
              <div className="flagship-stat-label">customer rating</div>
            </div>
            <div className="flagship-stat-col">
              <div className="flagship-stat-number"><CountUp end={totalProductsCount} duration={1000} suffix="+" /></div>
              <div className="flagship-stat-label">curated products</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE / TICKER STRIP - Full Bleed ───────────────────── */}
      <MarqueeStrip />

      {/* ── MAIN PAGE SECTIONS - inside container padding ─────────── */}
      <div className="container mx-auto px-4 sm:px-6 w-full max-w-[1200px]">

        {/* ── SOCIAL PROOF / TRUST SIGNALS BAR ────────────────────── */}
        <section className="trust-bar reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" aria-label="Store Benefits & Guarantees">
          <div className="trust-item">
            <div className="trust-icon-box"><Truck size={22} /></div>
            <div>
              <div className="trust-title">Free Express Shipping</div>
              <p className="trust-desc">Fast, tracked delivery on orders over $50</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon-box"><Award size={22} /></div>
            <div>
              <div className="trust-title">4.9 / 5 Rating</div>
              <p className="trust-desc">Backed by 12,500+ verified customer reviews</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon-box"><ShieldCheck size={22} /></div>
            <div>
              <div className="trust-title">Secure Stripe Checkout</div>
              <p className="trust-desc">256-bit encryption for all card payments</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon-box"><RotateCcw size={22} /></div>
            <div>
              <div className="trust-title">30-Day Easy Returns</div>
              <p className="trust-desc">Hassle-free refunds &amp; friendly support</p>
            </div>
          </div>
        </section>

        {/* ── CATEGORY SHOWCASE ───────────────────────────────────── */}
        <section className="home-section">
          <div className="flex justify-between items-center mb-11 flex-wrap gap-4 reveal">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Shop by Category</h2>
              <p style={{ color: 'var(--color-muted-text)', fontSize: '0.95rem' }}>Find exactly what you need in our curated sections</p>
            </div>
            <Link to="/products" className="btn btn-outline" style={{ gap: '0.4rem' }}>
              Browse Catalog <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORY_DATA.map(({ name, Icon, color, desc }, i) => (
              <Link
                key={name}
                to={`/products?category=${name}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="category-showcase-card reveal text-center p-6 cursor-pointer h-full"
                  data-delay={String(i * 80)}
                >
                  <div
                    className="category-icon-wrapper"
                    style={{ width: '64px', height: '64px', margin: '0 auto 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Icon size={32} color={color} strokeWidth={2.2} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--color-foreground)', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)', margin: 0 }}>{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── FEATURED PRODUCTS ───────────────────────────────────── */}
        <section className="home-section">
          <div className="flex justify-between items-center mb-11 flex-wrap gap-4 reveal">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Featured Products</h2>
              <p style={{ color: 'var(--color-muted-text)', fontSize: '0.95rem' }}>Top picks from our latest collection</p>
            </div>
            <Link to="/products" className="btn btn-outline" style={{ gap: '0.4rem' }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map((prod, i) => (
                <div
                  key={prod._id}
                  className="card product-card reveal cursor-pointer relative flex flex-col h-full"
                  data-delay={String(i * 80)}
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

                  <div className="product-image-container" style={{ marginBottom: '1rem' }}>
                    {prod.image?.startsWith('http') ? (
                      <img src={prod.image} alt={prod.name} className="product-image" loading="lazy" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                    ) : null}
                    <div style={{ display: prod.image?.startsWith('http') ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <Package size={56} color="var(--color-muted-text)" />
                    </div>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
                    {prod.category}
                  </div>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      marginBottom: '0.45rem',
                      lineHeight: 1.35,
                      minHeight: '2.7rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      color: 'var(--color-foreground)'
                    }}
                  >
                    {prod.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s<=4?'#f59e0b':'none'} stroke='#f59e0b' />)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '1px solid var(--color-border)', marginTop: 'auto', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
                      ${Number(prod.price || 0).toFixed(2)}
                    </span>
                    <button
                      onClick={e => handleAddToCart(e, prod)}
                      className="btn btn-accent"
                      style={{
                        padding: '0.45rem 0.85rem',
                        fontSize: '0.82rem',
                        whiteSpace: 'nowrap',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontWeight: 700,
                        flexShrink: 0
                      }}
                      disabled={prod.stock <= 0}
                    >
                      <ShoppingCart size={14} />
                      {prod.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── DISTINCT SPLIT CTA BANNER ───────────────────────────── */}
        <section className="cta-split-banner reveal grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
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

      </div>{/* end container */}
    </div>
  );
}

