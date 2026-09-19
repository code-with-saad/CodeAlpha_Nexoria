import React, { useEffect, useRef } from 'react';
import { X, Package, MapPin, CreditCard, Calendar, User, Clock, CheckCircle, Truck, XCircle, FileText, Download } from 'lucide-react';
import { generateOrderReceiptPDF } from '../utils/generateReceipt';

export default function OrderDetailModal({
  isOpen,
  onClose,
  order = null
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const getFulfillmentBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="status-pill status-online">
            <CheckCircle size={13} />
            Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="status-pill status-shipped">
            <Truck size={13} />
            Shipped
          </span>
        );
      case 'Processing':
        return (
          <span className="status-pill status-processing">
            <Clock size={13} />
            Processing
          </span>
        );
      case 'Cancelled':
        return (
          <span className="status-pill status-offline">
            <XCircle size={13} />
            Cancelled
          </span>
        );
      case 'Paid':
        return (
          <span className="status-pill status-online">
            <CheckCircle size={13} />
            Paid
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="status-pill status-pending">
            <Clock size={13} />
            Pending
          </span>
        );
    }
  };

  const handleDownloadPDF = () => {
    try {
      generateOrderReceiptPDF(order);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    }
  };

  return (
    <div
      className="admin-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="admin-modal-card admin-order-detail-modal"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div className="admin-modal-header">
          <div>
            <div className="admin-modal-tag">ORDER BREAKDOWN</div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0.2rem 0 0 0', color: 'var(--color-foreground)' }}>
              Order #{order._id.slice(-8).toUpperCase()}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleDownloadPDF}
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', gap: '0.35rem' }}
              title="Download PDF Invoice"
            >
              <Download size={14} />
              PDF Invoice
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              style={{ padding: '0.45rem' }}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="admin-order-detail-body">
          {/* Status & Meta Summary Banner */}
          <div className="admin-order-meta-grid">
            <div className="admin-order-meta-card">
              <span className="admin-order-meta-label">Customer</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                <User size={15} color="var(--color-primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-foreground)' }}>
                  {order.user?.name || 'Customer'}
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-muted-text)' }}>
                {order.user?.email || 'N/A'}
              </span>
            </div>

            <div className="admin-order-meta-card">
              <span className="admin-order-meta-label">Date Placed</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                <Calendar size={15} color="var(--color-secondary)" />
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-foreground)' }}>
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-muted-text)' }}>
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="admin-order-meta-card">
              <span className="admin-order-meta-label">Payment Status</span>
              <div style={{ marginTop: '0.25rem' }}>
                {order.isPaid ? (
                  <span className="status-pill status-online" style={{ fontSize: '0.75rem' }}>
                    <CheckCircle size={12} />
                    Paid ({order.paymentMethod || 'Stripe'})
                  </span>
                ) : (
                  <span className="status-pill status-pending" style={{ fontSize: '0.75rem' }}>
                    <Clock size={12} />
                    Unpaid
                  </span>
                )}
              </div>
            </div>

            <div className="admin-order-meta-card">
              <span className="admin-order-meta-label">Fulfillment Status</span>
              <div style={{ marginTop: '0.25rem' }}>
                {getFulfillmentBadge(order.status)}
              </div>
            </div>
          </div>

          {/* Shipping Address & Payment Details */}
          <div className="admin-order-address-box">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
              <MapPin size={18} color="var(--color-primary)" style={{ marginTop: '0.15rem' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-foreground)' }}>
                  Shipping Destination
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)', marginTop: '0.15rem' }}>
                  {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
                  {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div style={{ marginTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-muted-text)', marginBottom: '0.75rem' }}>
              Purchased Items ({order.orderItems?.length || 0})
            </h4>
            <div className="admin-order-items-list">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="admin-order-item-row">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="admin-order-item-img"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-foreground)' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-text)', marginTop: '0.1rem' }}>
                      Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-foreground)' }}>
                    ${(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="admin-order-financials">
            <div className="admin-financial-row">
              <span>Subtotal:</span>
              <span>${Number(order.itemsPrice || 0).toFixed(2)}</span>
            </div>
            <div className="admin-financial-row">
              <span>Estimated Tax:</span>
              <span>${Number(order.taxPrice || 0).toFixed(2)}</span>
            </div>
            <div className="admin-financial-row">
              <span>Shipping:</span>
              <span>${Number(order.shippingPrice || 0).toFixed(2)}</span>
            </div>
            <div className="admin-financial-row total" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem', marginTop: '0.5rem', fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
              <span>Total Paid:</span>
              <span>${Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="admin-modal-actions" style={{ marginTop: '1.5rem', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
