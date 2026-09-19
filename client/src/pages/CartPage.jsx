import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function CartPage() {
  const {
    cartItems,
    totalItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) {
      toast.warning('Your shopping cart is empty.', { title: 'Empty Cart' });
      return;
    }

    if (!isAuthenticated) {
      toast.info('Please sign in or register to complete your checkout.', {
        title: 'Authentication Required'
      });
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Shopping Cart</h1>
          <p style={{ color: 'var(--color-muted-text)' }}>
            Review items, modify quantities, and proceed to secure checkout.
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1.25rem', background: 'var(--color-muted)', borderRadius: '50%', marginBottom: '1.25rem' }}>
            <ShoppingBag size={48} color="var(--color-muted-text)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--color-muted-text)', maxWidth: '450px', margin: '0 auto 2rem' }}>
            Looks like you haven't added anything to your cart yet. Explore our product catalog to discover trending items!
          </p>
          <Link to="/products" className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
            Browse Catalog <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Shopping Cart</h1>
          <p style={{ color: 'var(--color-muted-text)' }}>
            You have <strong>{totalItems}</strong> {totalItems === 1 ? 'item' : 'items'} in your cart.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="btn btn-outline"
          style={{ fontSize: '0.85rem', padding: '0.45rem 0.95rem' }}
        >
          Clear Cart
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* CART ITEMS LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cartItems.map((item) => (
            <div
              key={item.product}
              className="card"
              style={{
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'center',
                padding: '1.25rem',
                flexWrap: 'wrap'
              }}
            >
              {/* Product Thumbnail */}
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  background: 'var(--color-muted)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                {item.image?.startsWith('http') ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  style={{
                    display: item.image?.startsWith('http') ? 'none' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    width: '100%'
                  }}
                >
                  <ShoppingBag size={32} color="var(--color-muted-text)" />
                </div>
              </div>

              {/* Product Info */}
              <div style={{ flex: '1 1 200px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {item.category || 'Product'}
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                  <Link to={`/products/${item.product}`} style={{ color: 'var(--color-foreground)' }}>
                    {item.name}
                  </Link>
                </h3>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  ${item.price.toFixed(2)}
                </div>
              </div>

              {/* Quantity Controls */}
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
                  onClick={() => updateQuantity(item.product, item.quantity - 1)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    background: 'var(--color-muted)',
                    fontSize: '1rem',
                    fontWeight: 700
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    padding: '0.35rem 0.85rem',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    minWidth: '2rem',
                    textAlign: 'center'
                  }}
                >
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.product, item.quantity + 1)}
                  disabled={item.quantity >= (item.stock || 99)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    background: 'var(--color-muted)',
                    fontSize: '1rem',
                    fontWeight: 700
                  }}
                >
                  +
                </button>
              </div>

              {/* Item Subtotal & Delete */}
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  onClick={() => removeFromCart(item.product)}
                  style={{ color: 'var(--color-destructive)', padding: '0.35rem', display: 'flex', alignItems: 'center' }}
                  title="Remove item"
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY SIDEBAR */}
        <div className="card" style={{ padding: '2rem', position: 'sticky', top: '5.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            Order Summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-muted-text)' }}>Items Subtotal:</span>
              <span style={{ fontWeight: 700 }}>${itemsPrice.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-muted-text)' }}>Estimated Shipping:</span>
              <span style={{ fontWeight: 700 }}>
                {shippingPrice === 0 ? (
                  <span style={{ color: 'var(--color-primary)' }}>FREE ($100+ Promo)</span>
                ) : (
                  `$${shippingPrice.toFixed(2)}`
                )}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-muted-text)' }}>Estimated Tax (8%):</span>
              <span style={{ fontWeight: 700 }}>${taxPrice.toFixed(2)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.85rem',
                borderTop: '2px dashed var(--color-border)',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--color-foreground)'
              }}
            >
              <span>Total:</span>
              <span style={{ color: 'var(--color-primary)' }}>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckoutClick}
            className="btn btn-accent"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1.05rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-muted-text)', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={15} /> Encrypted 256-bit checkout via Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
