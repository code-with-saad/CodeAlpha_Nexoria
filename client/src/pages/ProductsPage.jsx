import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Heart, ShoppingCart, ChevronLeft, ChevronRight, Package, X } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

const CATEGORIES = ['Electronics', 'Accessories', 'Lifestyle', 'Home'];
const MAX_PRICE_CAP = 2000;

export default function ProductsPage() {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [category, setCategory]       = useState('');   // '' = All
  const [maxPrice, setMaxPrice]       = useState(MAX_PRICE_CAP);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [limit, setLimit]             = useState(10);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [total, setTotal]             = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [wishlist, setWishlist]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('nexoria_wishlist') || '[]'); } catch { return []; }
  });

  const toast = useToast();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const gridRef = useRef(null);
  useScrollReveal(gridRef);

  /* ── Data Fetching ──────────────────────────────────────────────── */
  const fetchProducts = useCallback(async (pg = 1, currentLimit = limit) => {
    setLoading(true);
    try {
      const params = { page: pg, limit: currentLimit };
      if (search.trim())  params.search   = search.trim();
      if (category)       params.category  = category;
      if (inStockOnly)    params.inStock   = true;
      const { data } = await api.get('/products', { params });
      if (data?.data) {
        // client-side price filter (backend doesn't have maxPrice param yet)
        const filtered = maxPrice < MAX_PRICE_CAP
          ? data.data.filter(p => Number(p.price) <= maxPrice)
          : data.data;
        setProducts(filtered);
        setPage(data.page || pg);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || data.count || data.data.length);
      }
    } catch {
      toast.error('Failed to load products. Please try again.', { title: 'Connection Error' });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, maxPrice, inStockOnly, limit]);

  useEffect(() => { setPage(1); }, [search, category, maxPrice, inStockOnly, limit]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchProducts(1, limit), search ? 300 : 0);
    return () => clearTimeout(debounce);
  }, [search, category, maxPrice, inStockOnly, limit]);

  useEffect(() => { if (page > 1) fetchProducts(page); }, [page]);

  /* ── Handlers ───────────────────────────────────────────────────── */
  const toggleWishlist = (e, prodId) => {
    e.preventDefault(); e.stopPropagation();
    const isWished = wishlist.includes(prodId);
    const next = isWished ? wishlist.filter(id => id !== prodId) : [...wishlist, prodId];
    setWishlist(next);
    localStorage.setItem('nexoria_wishlist', JSON.stringify(next));
    toast.info(isWished ? 'Removed from wishlist' : 'Added to wishlist', { title: 'Wishlist' });
  };

  const handleAddToCart = (e, prod) => {
    e.preventDefault(); e.stopPropagation();
    if (prod.stock <= 0) { toast.warning('This item is out of stock.', { title: 'Out of Stock' }); return; }
    addToCart(prod, 1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearch(''); setCategory(''); setMaxPrice(MAX_PRICE_CAP); setInStockOnly(false);
  };

  const hasActiveFilters = category || maxPrice < MAX_PRICE_CAP || inStockOnly || search.trim();

  /* ── Sidebar filter panel (shared for desktop + mobile) ─────────── */
  const FilterPanel = () => (
    <div>
      <div className="filter-sidebar-title">Filters</div>

      {/* Search */}
      <div className="filter-section">
        <span className="filter-section-label">Search</span>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-text)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2rem', fontSize: '0.88rem' }}
          />
        </div>
      </div>

      {/* Category */}
      <div className="filter-section">
        <span className="filter-section-label">Category</span>
        <div className="filter-radio-group">
          <label className="filter-radio-item">
            <input type="radio" name="category" checked={category === ''} onChange={() => setCategory('')} />
            All Categories
          </label>
          {CATEGORIES.map(cat => (
            <label key={cat} className="filter-radio-item">
              <input type="radio" name="category" checked={category === cat} onChange={() => setCategory(cat)} />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Max Price */}
      <div className="filter-section">
        <span className="filter-section-label">Max Price</span>
        <input
          type="range"
          className="filter-range-slider"
          min={0}
          max={MAX_PRICE_CAP}
          step={25}
          value={maxPrice}
          onChange={e => setMaxPrice(Number(e.target.value))}
        />
        <span className="filter-range-value">
          {maxPrice >= MAX_PRICE_CAP ? 'Any price' : `Up to $${maxPrice}`}
        </span>
      </div>

      {/* In Stock only */}
      <div className="filter-section">
        <span className="filter-section-label">Availability</span>
        <div className="filter-toggle-row">
          <span className="filter-toggle-label">In Stock Only</span>
          <label className="filter-toggle">
            <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} />
            <span className="filter-toggle-track" />
          </label>
        </div>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button className="filter-clear-btn" onClick={clearFilters}>
          Clear All Filters
        </button>
      )}
    </div>
  );

  /* ── Skeleton ──────────────────────────────────────────────────── */
  const SkeletonGrid = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
      {Array.from({ length: Math.min(limit, 12) }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton skeleton-img" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '0.25rem' }}>
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text-sm" />
            <div className="skeleton" style={{ height: '14px', width: '30%' }} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="page-header">
        <span className="eyebrow-badge eyebrow-badge-emerald">Shop The Collection</span>
        <h1 className="page-title">Catalog &amp; Products</h1>
        <p className="page-subtitle">
          {total > 0 ? `${total} items meticulously engineered for performance and durability.` : 'Discover our curated collection of premium goods.'}
        </p>
      </div>

      {/* Mobile Filters trigger (visible on tablet/mobile) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          className="filter-mobile-btn"
          onClick={() => setMobileFiltersOpen(true)}
          aria-label="Open filters"
        >
          <SlidersHorizontal size={16} />
          Filters
          {hasActiveFilters && (
            <span style={{ background: 'var(--color-primary)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, borderRadius: '100px', padding: '0.1rem 0.4rem', marginLeft: '0.25rem' }}>
              ●
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-text)' }}>
            Filters active
          </span>
        )}
      </div>

      {/* Mobile filter backdrop + panel */}
      {mobileFiltersOpen && (
        <div
          className="filter-mobile-backdrop open"
          style={{ display: 'block' }}
          onClick={() => setMobileFiltersOpen(false)}
        >
          <div
            className="filter-mobile-panel"
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1rem' }}>Filters</span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                style={{ color: 'var(--color-muted-text)', background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}

      {/* Sidebar + Grid Layout */}
      <div className="products-layout">

        {/* Left Sidebar */}
        <aside className="filter-sidebar">
          <FilterPanel />
        </aside>

        {/* Main Grid Area */}
        <div ref={gridRef}>
          {loading ? (
            <SkeletonGrid />
          ) : products.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
              <Package size={56} style={{ color: 'var(--color-muted-text)', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No products found</h3>
              <p style={{ color: 'var(--color-muted-text)', marginBottom: '1.5rem' }}>
                No items matched your current filters.
              </p>
              <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              {/* Results info */}
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)', marginBottom: '1rem', fontWeight: 600 }}>
                Showing {products.length} of {total} results
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {products.map((prod, i) => (
                  <div
                    key={prod._id}
                    className="card product-card reveal"
                    data-delay={String((i % 4) * 60)}
                    style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                    onClick={() => navigate(`/products/${prod._id}`)}
                  >
                    {/* Wishlist */}
                    <button
                      onClick={e => toggleWishlist(e, prod._id)}
                      style={{
                        position: 'absolute', top: '1rem', right: '1rem', zIndex: 2,
                        background: 'rgba(255,255,255,0.9)', border: '1px solid var(--color-border)',
                        borderRadius: '50%', width: '36px', height: '36px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s', cursor: 'pointer'
                      }}
                      title={wishlist.includes(prod._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart size={17} fill={wishlist.includes(prod._id) ? '#ef4444' : 'none'} stroke={wishlist.includes(prod._id) ? '#ef4444' : 'var(--color-muted-text)'} />
                    </button>

                    {/* Image */}
                    <div className="product-image-container" style={{ marginBottom: '1rem' }}>
                      {prod.image?.startsWith('http') ? (
                        <img src={prod.image} alt={prod.name} className="product-image" loading="lazy"
                          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                      ) : null}
                      <div style={{ display: prod.image?.startsWith('http') ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Package size={56} color="var(--color-muted-text)" />
                      </div>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
                      {prod.category}
                    </div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.45rem', lineHeight: 1.35 }}>{prod.name}</h3>
                    <p style={{ color: 'var(--color-muted-text)', fontSize: '0.83rem', lineHeight: '1.45', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                      {prod.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '1px solid var(--color-border)', marginTop: 'auto' }}>
                      <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                        ${Number(prod.price || 0).toFixed(2)}
                      </span>
                      <button
                        onClick={e => handleAddToCart(e, prod)}
                        className="btn btn-accent"
                        style={{ padding: '0.45rem 0.9rem', fontSize: '0.83rem', gap: '0.4rem' }}
                        disabled={prod.stock <= 0}
                        title={prod.stock <= 0 ? 'Out of stock' : 'Add to cart'}
                      >
                        <ShoppingCart size={15} />
                        {prod.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>

                    {prod.stock > 0 && prod.stock <= 5 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-warning-text)', fontWeight: 700, marginTop: '0.5rem', textAlign: 'right' }}>
                        Only {prod.stock} left!
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginTop: '3.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-muted-text)', fontWeight: 600 }}>Items per page:</span>
                  <select
                    value={limit}
                    onChange={e => setLimit(Number(e.target.value))}
                    className="form-select"
                    style={{ width: 'auto', padding: '0.4rem 0.85rem', fontSize: '0.875rem' }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
                    <button className="btn btn-outline" onClick={() => handlePageChange(page - 1)} disabled={page <= 1} style={{ padding: '0.5rem 0.85rem' }} aria-label="Previous page">
                      <ChevronLeft size={18} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                      <button
                        key={pg}
                        onClick={() => handlePageChange(pg)}
                        style={{
                          width: '38px', height: '38px', borderRadius: 'var(--radius-md)',
                          background: pg === page ? 'var(--color-primary)' : 'transparent',
                          color: pg === page ? '#fff' : 'var(--color-foreground)',
                          border: '1px solid', borderColor: pg === page ? 'var(--color-primary)' : 'var(--color-border)',
                          fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        {pg}
                      </button>
                    ))}
                    <button className="btn btn-outline" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages} style={{ padding: '0.5rem 0.85rem' }} aria-label="Next page">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
