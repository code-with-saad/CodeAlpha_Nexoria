import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Heart, ShoppingCart, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['All', 'Electronics', 'Accessories', 'Lifestyle', 'Home'];
const LIMIT = 12;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nexoria_wishlist') || '[]'); } catch { return []; }
  });

  const toast = useToast();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const fetchProducts = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const params = { page: pg, limit: LIMIT };
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      const { data } = await api.get('/products', { params });
      if (data?.data) {
        setProducts(data.data);
        setPage(data.page || pg);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || data.count || data.data.length);
      }
    } catch (error) {
      toast.error('Failed to load products. Please try again.', { title: 'Connection Error' });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, category]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchProducts(1), search ? 300 : 0);
    return () => clearTimeout(debounce);
  }, [search, category]);

  useEffect(() => {
    if (page > 1) fetchProducts(page);
  }, [page]);

  const toggleWishlist = (e, prodId) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => {
      const next = prev.includes(prodId) ? prev.filter(id => id !== prodId) : [...prev, prodId];
      localStorage.setItem('nexoria_wishlist', JSON.stringify(next));
      toast.info(prev.includes(prodId) ? 'Removed from wishlist' : 'Added to wishlist', { title: 'Wishlist' });
      return next;
    });
  };

  const handleAddToCart = (e, prod) => {
    e.preventDefault();
    e.stopPropagation();
    if (prod.stock <= 0) {
      toast.warning('This item is out of stock.', { title: 'Out of Stock' });
      return;
    }
    addToCart(prod, 1);
    toast.success(prod.name + ' added to cart!', { title: 'Cart Updated' });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const SkeletonGrid = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.75rem' }}>
      {Array.from({ length: LIMIT }).map((_, i) => (
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
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Explore Products</h1>
        <p style={{ color: 'var(--color-muted-text)' }}>
          {total > 0 ? `${total} products in our catalog` : 'Discover our curated collection of premium goods.'}
        </p>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={17} style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-muted-text)', zIndex: 1 }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <div className="category-pills">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={category-pill}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      {loading ? (
        <SkeletonGrid />
      ) : products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <Package size={56} style={{ color: 'var(--color-muted-text)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No products found</h3>
          <p style={{ color: 'var(--color-muted-text)', marginBottom: '1.5rem' }}>
            No items matched your current filters.
          </p>
          <button className="btn btn-outline" onClick={() => { setSearch(''); setCategory('All'); }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.75rem' }}>
            {products.map(prod => (
              <div
                key={prod._id}
                className="card product-card"
                style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                onClick={() => navigate(/products/)}
              >
                {/* WISHLIST BUTTON */}
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
                  <Heart
                    size={17}
                    fill={wishlist.includes(prod._id) ? '#ef4444' : 'none'}
                    stroke={wishlist.includes(prod._id) ? '#ef4444' : 'var(--color-muted-text)'}
                  />
                </button>

                {/* PRODUCT IMAGE */}
                <div className="product-image-container" style={{ marginBottom: '1rem' }}>
                  {prod.image?.startsWith('http') ? (
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="product-image"
                      loading="lazy"
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <div style={{ display: prod.image?.startsWith('http') ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Package size={56} color="var(--color-muted-text)" />
                  </div>
                </div>

                {/* BADGE */}
                <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
                  {prod.category}
                </div>

                {/* TITLE */}
                <h3 style={{ fontSize: '1rem', marginBottom: '0.45rem', lineHeight: 1.35 }}>
                  {prod.name}
                </h3>

                {/* DESCRIPTION PREVIEW */}
                <p style={{ color: 'var(--color-muted-text)', fontSize: '0.83rem', lineHeight: '1.45', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                  {prod.description}
                </p>

                {/* PRICE + ACTIONS */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '1px solid var(--color-border)', marginTop: 'auto' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                    
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
                  <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700, marginTop: '0.5rem', textAlign: 'right' }}>
                    Only {prod.stock} left!
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '3rem' }}>
              <button
                className="btn btn-outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                style={{ padding: '0.5rem 0.85rem' }}
              >
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
                    border: '1px solid',
                    borderColor: pg === page ? 'var(--color-primary)' : 'var(--color-border)',
                    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {pg}
                </button>
              ))}
              <button
                className="btn btn-outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                style={{ padding: '0.5rem 0.85rem' }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
