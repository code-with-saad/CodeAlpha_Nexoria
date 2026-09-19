import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, FileText, ShoppingBag, ArrowRight, Truck, Clock, CheckCircle, XCircle } from 'lucide-react';
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

  const getFulfillmentBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="status-pill status-online" style={{ fontSize: '0.75rem' }}>
            <CheckCircle size={13} />
            Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="status-pill status-shipped" style={{ fontSize: '0.75rem' }}>
            <Truck size={13} />
            Shipped
          </span>
        );
      case 'Processing':
        return (
          <span className="status-pill status-processing" style={{ fontSize: '0.75rem' }}>
            <Clock size={13} />
            Processing
          </span>
        );
      case 'Cancelled':
        return (
          <span className="status-pill status-offline" style={{ fontSize: '0.75rem' }}>
            <XCircle size={13} />
            Cancelled
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="status-pill" style={{ background: 'var(--color-muted)', color: 'var(--color-muted-text)', fontSize: '0.75rem' }}>
            <Clock size={13} />
            Pending
          </span>
        );
    }
  };

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
          <div style={{ display: 'inline-flex', padding: '1.25rem', background: 'var(--color-muted)', borderRadius: '50%', marginBottom: '1.25rem' }}>
            <Package size={48} color="var(--color-muted-text)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Orders Found</h2>
          <p style={{ color: 'var(--color-muted-text)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            You haven't placed any orders with Nexoria yet. Browse our curated items to make your first purchase!
          </p>
          <Link to="/products" className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
            Explore Products <ArrowRight size={17} />
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
                paddingBottom: '1.25rem',
                marginBottom: '1.25rem'
              }}
            >
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-text)', textTransform: 'uppercase', fontWeight: 600 }}>
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
                <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-text)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Total Amount
                </span>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                  ${Number(order.totalAmount || 0).toFixed(2)}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-text)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Payment
                </span>
                <div>
                  <span className={`status-pill ${order.isPaid ? 'status-online' : 'status-offline'}`} style={{ fontSize: '0.75rem' }}>
                    <span className="status-indicator-dot" />
                    {order.isPaid ? 'Paid via Stripe' : 'Payment Pending'}
                  </span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-text)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Fulfillment
                </span>
                <div>
                  {getFulfillmentBadge(order.status || (order.isDelivered ? 'Delivered' : 'Processing'))}
                </div>
              </div>

              <div>
                <Link
                  to={`/order-confirmation/${order._id}`}
                  className="btn btn-outline"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <FileText size={15} />
                  <span>View Receipt</span>
                </Link>
              </div>
            </div>

            {/* ORDER ITEMS WITH THUMBNAILS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {order.orderItems?.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.9rem',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    padding: '0.35rem 0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Item Thumbnail */}
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--color-muted)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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
                      <div style={{ display: item.image?.startsWith('http') ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Package size={20} color="var(--color-muted-text)" />
                      </div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--color-foreground)' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-text)' }}>
                        Qty: {item.quantity} &bull; ${Number(item.price || 0).toFixed(2)} each
                      </div>
                    </div>
                  </div>

                  <span style={{ fontWeight: 800, color: 'var(--color-foreground)', fontSize: '0.95rem' }}>
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
