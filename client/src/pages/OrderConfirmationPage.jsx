import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Package, ShoppingBag, ArrowRight, Download } from 'lucide-react';
import api from '../services/api';
import { generateOrderReceiptPDF } from '../utils/generateReceipt';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/orders/${id}`);
          if (res.data?.data) {
            setOrder(res.data.data);
          }
        } catch (err) {
          console.warn('Could not fetch confirmation details from backend:', err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: '700px', margin: '3rem auto' }}>
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="skeleton" style={{ height: '32px', width: '60%', margin: '0 auto 1.5rem' }} />
          <div className="skeleton" style={{ height: '120px', width: '100%' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page" style={{ maxWidth: '780px', margin: '1rem auto' }}>
      {/* SUCCESS HERO BANNER */}
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          borderTop: '6px solid var(--color-primary)',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'inline-flex', padding: '1.25rem', background: 'var(--color-muted)', borderRadius: '50%', marginBottom: '1.25rem' }}>
          <CheckCircle2 size={48} color="var(--color-primary)" />
        </div>
        <h1 style={{ fontSize: '2.25rem', color: 'var(--color-foreground)', marginBottom: '0.5rem' }}>
          Thank You for Your Order!
        </h1>
        <p style={{ color: 'var(--color-muted-text)', fontSize: '1.05rem', marginBottom: '1.25rem' }}>
          Your payment has been authorized and your order is being processed for shipment.
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'var(--color-muted)', padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', fontSize: '0.9rem' }}>
          <span>Order Reference:</span>
          <strong style={{ color: 'var(--color-primary)' }}>#{id || order?._id || 'NEX-89472'}</strong>
        </div>
      </div>

      {/* ORDER DETAILS BREAKDOWN */}
      {order && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.35rem', margin: 0 }}>
              Order Summary
            </h2>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => generateOrderReceiptPDF(order)}
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Download size={15} />
              Download Receipt (PDF)
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
            <div>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--color-muted-text)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Delivery Address
              </h3>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: '1.5' }}>
                {order.shippingAddress?.address}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
                {order.shippingAddress?.country}
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--color-muted-text)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Payment Status
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span className="status-pill status-online">
                  <span className="status-indicator-dot" /> Paid via Stripe
                </span>
              </div>
            </div>
          </div>

          {/* ORDER ITEMS LIST */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Items Ordered</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {order.orderItems?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.95rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{item.quantity}×</span>
                    <span>{item.name}</span>
                  </div>
                  <span style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1.25rem',
                paddingTop: '1rem',
                borderTop: '2px dashed var(--color-border)',
                fontSize: '1.25rem',
                fontWeight: 800
              }}
            >
              <span>Total Paid:</span>
              <span style={{ color: 'var(--color-primary)' }}>${Number(order.totalAmount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {order && (
          <button
            type="button"
            onClick={() => generateOrderReceiptPDF(order)}
            className="btn btn-primary"
            style={{ padding: '0.85rem 1.75rem' }}
          >
            <Download size={17} />
            Download Receipt (PDF)
          </button>
        )}
        <Link to="/orders" className="btn btn-outline" style={{ padding: '0.85rem 1.75rem' }}>
          <Package size={17} />
          View My Orders
        </Link>
        <Link to="/products" className="btn btn-outline" style={{ padding: '0.85rem 1.75rem' }}>
          <ShoppingBag size={17} />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
