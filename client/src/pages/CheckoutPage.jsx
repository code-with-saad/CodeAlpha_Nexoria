import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, CreditCard, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function CheckoutPage() {
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'United States'
  });

  const [cardData, setCardData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    expDate: '12/28',
    cvc: '123'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning('Please sign in to access checkout.', { title: 'Authentication Required' });
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    if (cartItems.length === 0) {
      toast.warning('Your cart is empty. Please add items before checking out.', {
        title: 'Empty Cart'
      });
      navigate('/products');
    }
  }, [isAuthenticated, cartItems.length]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateAddress = () => {
    const errors = {};
    if (!shippingAddress.address.trim()) errors.address = 'Street address is required';
    if (!shippingAddress.city.trim()) errors.city = 'City is required';
    if (!shippingAddress.postalCode.trim()) errors.postalCode = 'Postal / Zip code is required';
    if (!shippingAddress.country.trim()) errors.country = 'Country is required';
    return errors;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const errors = validateAddress();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please complete all required shipping address fields.', {
        title: 'Validation Error'
      });
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create Order on Backend
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        shippingAddress,
        paymentMethod: 'Stripe',
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalAmount: totalPrice
      };

      const orderRes = await api.post('/orders', orderPayload);
      const createdOrder = orderRes.data?.data;

      if (!createdOrder || !createdOrder._id) {
        throw new Error('Failed to create order record');
      }

      // 2. Request Stripe Payment Intent
      const paymentIntentRes = await api.post('/orders/create-payment-intent', {
        amount: totalPrice,
        currency: 'usd'
      });

      const { paymentIntentId } = paymentIntentRes.data;

      // 3. Confirm Payment and Mark Order as Paid
      await api.put(`/orders/${createdOrder._id}/pay`, {
        id: paymentIntentId || `pi_test_${Date.now()}`,
        status: 'succeeded',
        update_time: new Date().toISOString(),
        email_address: user.email
      });

      // 4. Clear Cart and Notify User
      clearCart();
      toast.success('Payment successful! Your order has been placed.', {
        title: 'Order Confirmed'
      });

      // 5. Navigate to Confirmation Page
      navigate(`/order-confirmation/${createdOrder._id}`, {
        state: { order: createdOrder }
      });
    } catch (error) {
      console.error('Checkout processing error:', error);
      toast.error(error.message || 'Payment processing failed. Please try again.', {
        title: 'Payment Error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-page">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Secure Checkout</h1>
        <p style={{ color: 'var(--color-muted-text)' }}>
          Review your order and complete payment powered by Stripe.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
        {/* LEFT COLUMN: SHIPPING & PAYMENT FORM */}
        <div>
          <form onSubmit={handlePlaceOrder}>
            {/* 1. SHIPPING ADDRESS */}
            <div className="card" style={{ marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} color="var(--color-primary)" />
                <span>1. Shipping Address</span>
              </h2>

              <div className="form-group">
                <label className="form-label" htmlFor="address">
                  Street Address
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  className="form-input"
                  placeholder="123 Market St, Suite 400"
                  value={shippingAddress.address}
                  onChange={handleAddressChange}
                  disabled={isProcessing}
                />
                {formErrors.address && <span className="form-error-text">{formErrors.address}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    className="form-input"
                    placeholder="San Francisco"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    disabled={isProcessing}
                  />
                  {formErrors.city && <span className="form-error-text">{formErrors.city}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="postalCode">
                    Postal / ZIP Code
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    name="postalCode"
                    className="form-input"
                    placeholder="94105"
                    value={shippingAddress.postalCode}
                    onChange={handleAddressChange}
                    disabled={isProcessing}
                  />
                  {formErrors.postalCode && (
                    <span className="form-error-text">{formErrors.postalCode}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="country">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  name="country"
                  className="form-input"
                  placeholder="United States"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                  disabled={isProcessing}
                />
                {formErrors.country && <span className="form-error-text">{formErrors.country}</span>}
              </div>
            </div>

            {/* 2. PAYMENT DETAILS (STRIPE TEST MODE) */}
            <div className="card" style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={20} color="var(--color-primary)" />
                  <span>2. Payment Method</span>
                </h2>
                <span className="brand-badge">
                  Stripe Test Mode
                </span>
              </div>

              <div
                style={{
                  background: 'var(--color-muted)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                  color: 'var(--color-foreground)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  <ShieldCheck size={16} color="var(--color-primary)" />
                  <span>Stripe Test Credentials:</span>
                </div>
                <code>4242 4242 4242 4242</code> &bull; Exp: <code>12/28</code> &bull; CVC: <code>123</code>
              </div>

              <div className="form-group">
                <label className="form-label">Card Number</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={cardData.cardNumber}
                    readOnly
                    style={{ fontWeight: 600 }}
                  />
                  <span style={{ position: 'absolute', right: '1rem', top: '0.75rem', color: 'var(--color-muted-text)' }}>
                    <CreditCard size={18} />
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Expires</label>
                  <input
                    type="text"
                    className="form-input"
                    value={cardData.expDate}
                    readOnly
                    style={{ fontWeight: 600 }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CVC</label>
                  <input
                    type="text"
                    className="form-input"
                    value={cardData.cvc}
                    readOnly
                    style={{ fontWeight: 600 }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-accent"
              style={{ width: '100%', padding: '0.95rem', fontSize: '1.1rem' }}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing Secure Payment...' : `Authorize & Pay $${totalPrice.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '5.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            Items in Your Order ({cartItems.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '280px', overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '0.25rem' }}>
            {cartItems.map((item) => (
              <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{item.quantity}×</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                    {item.name}
                  </span>
                </div>
                <span style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-muted-text)' }}>Subtotal:</span>
              <span style={{ fontWeight: 600 }}>${itemsPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-muted-text)' }}>Shipping:</span>
              <span style={{ fontWeight: 600 }}>
                {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-muted-text)' }}>Estimated Tax (8%):</span>
              <span style={{ fontWeight: 600 }}>${taxPrice.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '2px dashed var(--color-border)',
                fontSize: '1.2rem',
                fontWeight: 800
              }}
            >
              <span>Total:</span>
              <span style={{ color: 'var(--color-primary)' }}>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <Link to="/cart" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 700 }}>
              ← Edit Cart Items
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
