import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ShoppingCart, ArrowRight, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nexoria_wishlist')) || [];
    } catch {
      return [];
    }
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlistProducts();
  }, [wishlistIds]);

  const fetchWishlistProducts = async () => {
    if (wishlistIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Fetch each wishlisted product individually by its _id for accuracy
      const results = await Promise.allSettled(
        wishlistIds.map(id => api.get(`/products/${id}`))
      );
      const fetched = results
        .filter(r => r.status === 'fulfilled' && r.value?.data?.data)
        .map(r => r.value.data.data);
      setProducts(fetched);
    } catch (err) {
      console.error('Failed to load wishlist items', err);
      toast.error('Could not load your wishlist items.', { title: 'Wishlist Error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (prodId) => {
    const nextIds = wishlistIds.filter(id => id !== prodId);
    setWishlistIds(nextIds);
    localStorage.setItem('nexoria_wishlist', JSON.stringify(nextIds));
    setProducts(prev => prev.filter(p => p._id !== prodId));
    toast.info('Item removed from wishlist.', { title: 'Wishlist' });
  };

  const handleMoveToCart = (prod) => {
    if (prod.stock <= 0) {
      toast.warning('This item is currently out of stock.', { title: 'Out of Stock' });
      return;
    }
    addToCart(prod, 1);
    handleRemove(prod._id);
    toast.success(`${prod.name} moved to your cart!`, { title: 'Moved to Cart' });
  };

  return (
    <div className="wishlist-page" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <Heart size={26} color="var(--color-primary)" fill="var(--color-primary)" />
            <h1 style={{ fontSize: '2rem', margin: 0 }}>My Wishlist</h1>
          </div>
          <p style={{ color: 'var(--color-muted-text)' }}>
            {products.length} {products.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {products.length > 0 && (
          <Link to="/products" className="btn btn-outline" style={{ fontSize: '0.875rem' }}>
            Continue Shopping
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-card">
              <div className="skeleton skeleton-img" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '0.5rem' }}>
                <div className="skeleton skeleton-text" />
                <div className="skeleton skeleton-text-sm" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4.5rem 1.5rem' }}>
          <div style={{ display: 'inline-flex', padding: '1.5rem', background: 'var(--color-muted)', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <Heart size={48} color="var(--color-muted-text)" />
          </div>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Your wishlist is empty</h2>
          <p style={{ color: 'var(--color-muted-text)', maxWidth: '450px', margin: '0 auto 2rem', fontSize: '0.95rem' }}>
            Explore our catalog and click the heart icon on any product to save items you love.
          </p>
          <Link to="/products" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
            Discover Products <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(prod => (
            <div key={prod._id} className="card product-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="product-image-container" style={{ marginBottom: '1rem', cursor: 'pointer' }} onClick={() => navigate(`/products/${prod._id}`)}>
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
                  <Package size={52} color="var(--color-muted-text)" />
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
                {prod.category}
              </div>

              <h3
                style={{ fontSize: '1.05rem', marginBottom: '0.5rem', cursor: 'pointer' }}
                onClick={() => navigate(`/products/${prod._id}`)}
              >
                {prod.name}
              </h3>

              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '1.25rem' }}>
                ${Number(prod.price || 0).toFixed(2)}
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '0.6rem' }}>
                <button
                  onClick={() => handleMoveToCart(prod)}
                  className="btn btn-accent"
                  style={{ flex: 1, padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
                  disabled={prod.stock <= 0}
                >
                  <ShoppingCart size={15} />
                  {prod.stock <= 0 ? 'Out of Stock' : 'Move to Cart'}
                </button>
                <button
                  onClick={() => handleRemove(prod._id)}
                  className="btn btn-outline"
                  style={{ padding: '0.6rem 0.85rem', color: 'var(--color-destructive)', borderColor: 'var(--color-border)' }}
                  title="Remove from wishlist"
                  aria-label="Remove item from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
