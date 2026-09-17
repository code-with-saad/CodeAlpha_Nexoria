import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning('Please sign in to view your orders.', { title: 'Authentication Required' });
      navigate('/login', { state: { from: { pathname: '/orders' } } });
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get('/orders/myorders');
        if (response.data?.data) {
          setOrders(response.data.data);
        }
      } catch (err) {
        toast.error(err.message || 'Could not load your order history', {
          title: 'Order History Error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="orders-page">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Order History</h1>
          <p style={{ color: 'var(--color-muted-text)' }}>Loading your past purchases...</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {[1, 2].map((i) => (
            <div key={i} className="skeleton-card" style={{ padding: '2rem' }}>
              <div className="skeleton" style={{ height: '24px', width: '40%', marginBottom: '1rem' }} />
              <div className="skeleton" style={{ height: '60px', width: '100%' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Order History</h1>
          <p style={{ color: 'var(--color-muted-text)' }}>Track your recent purchases and receipts.</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📦</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Orders Found</h2>
          <p style={{ color: 'var(--color-muted-text)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            You haven't placed any orders with Nexoria yet. Browse our curated items to make your first purchase!
          </p>
          <Link to="/products" className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Order History</h1>
        <p style={{ color: 'var(--color-muted-text)' }}>
          You have placed <strong>{orders.length}</strong> {orders.length === 1 ? 'order' : 'orders'} with Nexoria.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {orders.map((order) => (
          <div key={order._id} className="card" style={{ padding: '1.75rem' }}>
            {/* ORDER HEADER */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '1rem',
                marginBottom: '1.25rem'
              }}
            >
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-text)', textTransform: 'uppercase' }}>
                  Order Placed
                </span>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-text)', textTransform: 'uppercase' }}>
                  Total Amount
                </span>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                  ${Number(order.totalAmount || 0).toFixed(2)}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-text)', textTransform: 'uppercase' }}>
                  Status
                </span>
                <div>
                  <span className={`status-pill ${order.isPaid ? 'status-online' : 'status-offline'}`}>
                    <span className="status-indicator-dot" />
                    {order.isPaid ? 'Paid via Stripe' : 'Payment Pending'}
                  </span>
                </div>
              </div>

              <div>
                <Link
                  to={`/order-confirmation/${order._id}`}
                  className="btn btn-outline"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                >
                  View Receipt 📄
                </Link>
              </div>
            </div>

            {/* ORDER ITEMS SUMMARY */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {order.orderItems?.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.9rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{item.quantity}×</span>
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                  </div>
                  <span style={{ color: 'var(--color-muted-text)' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
