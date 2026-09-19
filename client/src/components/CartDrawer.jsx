import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    totalItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    updateQuantity,
    removeFromCart
  } = useCart();

  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    if (cartItems.length === 0) {
      toast.warning('Your cart is empty.', { title: 'Empty Cart' });
      return;
    }
    if (!isAuthenticated) {
      toast.info('Please sign in to complete checkout.', { title: 'Authentication Required' });
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  const handleViewFullCart = () => {
    closeCart();
    navigate('/cart');
  };

  return (
    <div className="cart-drawer-backdrop" onClick={closeCart} aria-modal="true" role="dialog">
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* DRAWER HEADER */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={22} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Shopping Cart ({totalItems})</h2>
          </div>
          <button
            onClick={closeCart}
            className="btn btn-ghost"
            style={{ padding: '0.4rem', color: 'var(--color-muted-text)' }}
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* DRAWER BODY */}
        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <div style={{ display: 'inline-flex', padding: '1.25rem', background: 'var(--color-muted)', borderRadius: '50%', marginBottom: '1.25rem' }}>
                <ShoppingBag size={42} color="var(--color-muted-text)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>Your cart is empty</h3>
              <p style={{ color: 'var(--color-muted-text)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                Explore products to add them to your cart.
              </p>
              <button
                onClick={() => { closeCart(); navigate('/products'); }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem' }}
              >
                Browse Products <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  className="cart-item-bg"
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    alignItems: 'center'
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-card)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {item.image?.startsWith('http') ? (
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ShoppingBag size={24} color="var(--color-muted-text)" />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </h4>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                      ${Number(item.price || 0).toFixed(2)}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="cart-qty-wrapper">
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.product, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span style={{ padding: '0.15rem 0.6rem', fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.product, item.quantity + 1)}
                          disabled={item.quantity >= (item.stock || 99)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product)}
                        className="cart-remove-btn"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DRAWER FOOTER */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-muted-text)' }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: 700, color: 'var(--color-foreground)' }}>${itemsPrice.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 800 }}>
              <span>Estimated Total:</span>
              <span style={{ color: 'var(--color-primary)' }}>${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="btn btn-accent"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={17} />
            </button>

            <button
              onClick={handleViewFullCart}
              className="btn btn-outline"
              style={{ width: '100%', padding: '0.65rem', fontSize: '0.875rem' }}
            >
              View Full Cart Page
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-muted-text)', marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={14} /> Stripe 256-bit Encrypted Checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
