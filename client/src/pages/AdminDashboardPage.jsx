import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  DollarSign,
  Users,
  AlertCircle,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Filter,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import ProductFormModal from '../components/ProductFormModal';
import OrderDetailModal from '../components/OrderDetailModal';

export default function AdminDashboardPage() {
  const toast = useToast();

  // Active Navigation Tab: 'overview' | 'products' | 'orders'
  const [activeTab, setActiveTab] = useState('overview');

  // Overview Stats
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Products State
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Modals & Action States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productFormLoading, setProductFormLoading] = useState(false);

  const [deleteProductModal, setDeleteProductModal] = useState({
    isOpen: false,
    product: null,
    loading: false
  });

  const [viewOrderModal, setViewOrderModal] = useState({
    isOpen: false,
    order: null
  });

  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await api.get('/admin/stats');
      if (res.data?.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load dashboard metrics', {
        title: 'Stats Loading Error'
      });
    } finally {
      setStatsLoading(false);
    }
  }, [toast]);

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      // Limit 50 to get full administrative view
      const res = await api.get('/products?limit=50');
      if (res.data?.data) {
        setProducts(res.data.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch catalog products', {
        title: 'Catalog Error'
      });
    } finally {
      setProductsLoading(false);
    }
  }, [toast]);

  // Fetch Orders
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await api.get('/orders');
      if (res.data?.data) {
        setOrders(res.data.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch administrative orders', {
        title: 'Orders Error'
      });
    } finally {
      setOrdersLoading(false);
    }
  }, [toast]);

  // Initial Load
  useEffect(() => {
    fetchStats();
    fetchProducts();
    fetchOrders();
  }, [fetchStats, fetchProducts, fetchOrders]);

  // Handle Product Create / Edit Submit
  const handleProductSubmit = async (formData) => {
    setProductFormLoading(true);
    try {
      if (selectedProduct) {
        // Edit existing product
        const res = await api.put(`/products/${selectedProduct._id}`, formData);
        toast.success(`"${formData.name}" has been updated.`, {
          title: 'Product Updated'
        });
        setProducts((prev) =>
          prev.map((p) => (p._id === selectedProduct._id ? res.data.data : p))
        );
      } else {
        // Create new product
        const res = await api.post('/products', formData);
        toast.success(`"${formData.name}" has been published to catalog.`, {
          title: 'Product Created'
        });
        setProducts((prev) => [res.data.data, ...prev]);
      }
      setIsProductModalOpen(false);
      setSelectedProduct(null);
      fetchStats(); // Update product counts
    } catch (err) {
      toast.error(err.message || 'Failed to save product', {
        title: 'Save Failed'
      });
    } finally {
      setProductFormLoading(false);
    }
  };

  // Handle Product Delete
  const handleConfirmDeleteProduct = async () => {
    if (!deleteProductModal.product) return;
    setDeleteProductModal((prev) => ({ ...prev, loading: true }));
    try {
      await api.delete(`/products/${deleteProductModal.product._id}`);
      toast.success(`"${deleteProductModal.product.name}" was permanently removed.`, {
        title: 'Product Deleted'
      });
      setProducts((prev) =>
        prev.filter((p) => p._id !== deleteProductModal.product._id)
      );
      setDeleteProductModal({ isOpen: false, product: null, loading: false });
      fetchStats();
    } catch (err) {
      toast.error(err.message || 'Failed to delete product', {
        title: 'Deletion Error'
      });
      setDeleteProductModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // Handle Order Fulfillment Status Change
  const handleOrderStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order #${orderId.slice(-8).toUpperCase()} status updated to ${newStatus}`, {
        title: 'Status Updated'
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? res.data.data : o))
      );
      fetchStats(); // update revenue / pending counts
    } catch (err) {
      toast.error(err.message || 'Failed to update order status', {
        title: 'Update Error'
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      productSearch.trim() === '' ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory =
      productCategoryFilter === 'All' ||
      p.category.toLowerCase() === productCategoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      orderSearch.trim() === '' ||
      o._id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.user?.name && o.user.name.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (o.user?.email && o.user.email.toLowerCase().includes(orderSearch.toLowerCase()));
    const matchesStatus =
      orderStatusFilter === 'All' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const getFulfillmentBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="status-pill status-online" style={{ fontSize: '0.78rem' }}>
            <CheckCircle size={13} />
            Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="status-pill status-shipped" style={{ fontSize: '0.78rem' }}>
            <Truck size={13} />
            Shipped
          </span>
        );
      case 'Processing':
        return (
          <span className="status-pill status-processing" style={{ fontSize: '0.78rem' }}>
            <Clock size={13} />
            Processing
          </span>
        );
      case 'Cancelled':
        return (
          <span className="status-pill status-offline" style={{ fontSize: '0.78rem' }}>
            <XCircle size={13} />
            Cancelled
          </span>
        );
      case 'Paid':
        return (
          <span className="status-pill status-online" style={{ fontSize: '0.78rem' }}>
            <CheckCircle size={13} />
            Paid
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="status-pill status-pending" style={{ fontSize: '0.78rem' }}>
            <Clock size={13} />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="admin-page-container">
      {/* Admin Header Banner */}
      <div className="admin-header">
        <div className="admin-header-title-block">
          <div className="admin-header-eyebrow">
            <span className="admin-header-badge">MANAGEMENT PORTAL</span>
          </div>
          <h1 className="admin-header-title">Nexoria Administration</h1>
          <p className="admin-header-subtitle">
            Real-time catalog control, fulfillment processing, and commerce analytics.
          </p>
        </div>

        <div className="admin-header-quick-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              fetchStats();
              fetchProducts();
              fetchOrders();
              toast.info('Dashboard data refreshed', { title: 'Refreshed' });
            }}
            title="Refresh all metrics and tables"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setSelectedProduct(null);
              setIsProductModalOpen(true);
            }}
          >
            <Plus size={16} />
            Add New Product
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="admin-tabs-nav">
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutDashboard size={18} />
          <span>Overview</span>
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={18} />
          <span>Products</span>
          <span className="admin-tab-count">{products.length}</span>
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingBag size={18} />
          <span>Orders</span>
          <span className="admin-tab-count">{orders.length}</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: OVERVIEW & ANALYTICS
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="admin-tab-content">
          {/* Key Metric Cards */}
          <div className="admin-metrics-grid">
            {/* Revenue Card */}
            <div className="admin-metric-card">
              <div className="admin-metric-header">
                <span className="admin-metric-label">TOTAL REVENUE</span>
                <div className="admin-metric-icon-wrap" style={{ background: 'var(--color-primary-light)' }}>
                  <DollarSign size={20} color="var(--color-primary)" />
                </div>
              </div>
              <div className="admin-metric-value">
                {statsLoading ? (
                  <div className="skeleton-box" style={{ height: '36px', width: '120px' }} />
                ) : (
                  `$${Number(stats?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                )}
              </div>
              <div className="admin-metric-subtext" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <TrendingUp size={14} color="var(--color-success)" />
                <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>Settled</span>
                <span>from paid transactions</span>
              </div>
            </div>

            {/* Total Orders Card */}
            <div className="admin-metric-card">
              <div className="admin-metric-header">
                <span className="admin-metric-label">TOTAL ORDERS</span>
                <div className="admin-metric-icon-wrap" style={{ background: 'var(--color-secondary-light)' }}>
                  <ShoppingBag size={20} color="var(--color-secondary)" />
                </div>
              </div>
              <div className="admin-metric-value">
                {statsLoading ? (
                  <div className="skeleton-box" style={{ height: '36px', width: '80px' }} />
                ) : (
                  stats?.totalOrders || 0
                )}
              </div>
              <div className="admin-metric-subtext">
                <span style={{ fontWeight: 700, color: stats?.pendingOrdersCount > 0 ? 'var(--color-warning)' : 'var(--color-muted-text)' }}>
                  {stats?.pendingOrdersCount || 0}
                </span>{' '}
                pending / processing orders
              </div>
            </div>

            {/* Total Products Card */}
            <div className="admin-metric-card">
              <div className="admin-metric-header">
                <span className="admin-metric-label">CATALOG PRODUCTS</span>
                <div className="admin-metric-icon-wrap" style={{ background: 'rgba(15, 118, 110, 0.12)' }}>
                  <Package size={20} color="#0F766E" />
                </div>
              </div>
              <div className="admin-metric-value">
                {statsLoading ? (
                  <div className="skeleton-box" style={{ height: '36px', width: '80px' }} />
                ) : (
                  stats?.totalProducts || 0
                )}
              </div>
              <div className="admin-metric-subtext">
                {stats?.lowStockCount > 0 ? (
                  <span style={{ color: 'var(--color-destructive)', fontWeight: 700 }}>
                    ⚠️ {stats.lowStockCount} items low in stock (&le; 5)
                  </span>
                ) : (
                  <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                    All inventory levels healthy
                  </span>
                )}
              </div>
            </div>

            {/* Registered Users Card */}
            <div className="admin-metric-card">
              <div className="admin-metric-header">
                <span className="admin-metric-label">REGISTERED CUSTOMERS</span>
                <div className="admin-metric-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.12)' }}>
                  <Users size={20} color="#3B82F6" />
                </div>
              </div>
              <div className="admin-metric-value">
                {statsLoading ? (
                  <div className="skeleton-box" style={{ height: '36px', width: '80px' }} />
                ) : (
                  stats?.totalUsers || 0
                )}
              </div>
              <div className="admin-metric-subtext">
                <span>Active shopper accounts</span>
              </div>
            </div>
          </div>

          {/* Recent Orders Overview Section */}
          <div className="admin-section-card" style={{ marginTop: '2rem' }}>
            <div className="admin-section-card-header">
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--color-foreground)' }}>
                  Recent Customer Orders
                </h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.84rem', color: 'var(--color-muted-text)' }}>
                  Latest customer purchases requiring review or fulfillment
                </p>
              </div>
              <button
                type="button"
                className="btn btn-outline"
                style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}
                onClick={() => setActiveTab('orders')}
              >
                View All Orders <ChevronRight size={14} />
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Fulfillment</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {statsLoading ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                        <div className="spinner-sm" style={{ margin: '0 auto 0.5rem auto' }} />
                        <span style={{ color: 'var(--color-muted-text)', fontSize: '0.85rem' }}>Loading recent orders...</span>
                      </td>
                    </tr>
                  ) : !stats?.recentOrders || stats.recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-muted-text)' }}>
                        No orders have been placed yet.
                      </td>
                    </tr>
                  ) : (
                    stats.recentOrders.map((ord) => (
                      <tr key={ord._id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)' }}>
                          #{ord._id.slice(-8).toUpperCase()}
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--color-foreground)' }}>
                            {ord.user?.name || 'Customer'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-text)' }}>
                            {ord.user?.email || 'N/A'}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)' }}>
                          {new Date(ord.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td style={{ fontWeight: 800, color: 'var(--color-foreground)' }}>
                          ${Number(ord.totalAmount).toFixed(2)}
                        </td>
                        <td>
                          {ord.isPaid ? (
                            <span className="status-pill status-online" style={{ fontSize: '0.72rem' }}>
                              <CheckCircle size={12} /> Paid
                            </span>
                          ) : (
                            <span className="status-pill status-pending" style={{ fontSize: '0.72rem' }}>
                              <Clock size={12} /> Unpaid
                            </span>
                          )}
                        </td>
                        <td>{getFulfillmentBadge(ord.status)}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem', gap: '0.3rem' }}
                            onClick={() => setViewOrderModal({ isOpen: true, order: ord })}
                          >
                            <Eye size={14} /> Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: PRODUCT MANAGEMENT
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'products' && (
        <div className="admin-tab-content">
          {/* Controls Bar */}
          <div className="admin-controls-bar">
            <div className="admin-search-wrap">
              <Search size={15} color="var(--color-muted-text)" />
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search products by title, category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>

            <div className="admin-filters-group">
              <select
                className="admin-select"
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Home">Home</option>
              </select>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setSelectedProduct(null);
                  setIsProductModalOpen(true);
                }}
              >
                <Plus size={16} />
                Add Product
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="admin-section-card">
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Flagship</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productsLoading ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="spinner-sm" style={{ margin: '0 auto 0.5rem auto' }} />
                        <span style={{ color: 'var(--color-muted-text)' }}>Loading product catalog...</span>
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-muted-text)' }}>
                        No products found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((prod) => (
                      <tr key={prod._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="admin-table-thumb"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';
                              }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--color-foreground)', fontSize: '0.92rem' }}>
                                {prod.name}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-text)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {prod.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="admin-category-badge">{prod.category}</span>
                        </td>
                        <td style={{ fontWeight: 800, color: 'var(--color-foreground)', fontSize: '0.95rem' }}>
                          ${Number(prod.price).toFixed(2)}
                        </td>
                        <td>
                          {prod.stock === 0 ? (
                            <span className="status-pill status-offline" style={{ fontSize: '0.75rem' }}>
                              Out of stock
                            </span>
                          ) : prod.stock <= 5 ? (
                            <span className="status-pill status-pending" style={{ fontSize: '0.75rem' }}>
                              Low: {prod.stock} left
                            </span>
                          ) : (
                            <span style={{ fontWeight: 600, color: 'var(--color-foreground)', fontSize: '0.9rem' }}>
                              {prod.stock} units
                            </span>
                          )}
                        </td>
                        <td>
                          {prod.isFeatured ? (
                            <span className="admin-featured-pill">
                              <Sparkles size={12} />
                              Featured
                            </span>
                          ) : (
                            <span style={{ color: 'var(--color-muted-text)', fontSize: '0.82rem' }}>Standard</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                            <button
                              type="button"
                              className="btn btn-ghost"
                              style={{ padding: '0.35rem 0.55rem' }}
                              onClick={() => {
                                setSelectedProduct(prod);
                                setIsProductModalOpen(true);
                              }}
                              title="Edit product"
                            >
                              <Edit2 size={15} color="var(--color-secondary)" />
                            </button>
                            <button
                              type="button"
                              className="btn btn-ghost"
                              style={{ padding: '0.35rem 0.55rem' }}
                              onClick={() =>
                                setDeleteProductModal({
                                  isOpen: true,
                                  product: prod,
                                  loading: false
                                })
                              }
                              title="Delete product"
                            >
                              <Trash2 size={15} color="var(--color-destructive)" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: ORDER MANAGEMENT
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="admin-tab-content">
          {/* Orders Controls Bar */}
          <div className="admin-controls-bar">
            <div className="admin-search-wrap">
              <Search size={15} color="var(--color-muted-text)" />
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search orders by ID, customer name or email..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
              />
            </div>

            <div className="admin-filters-group">
              <select
                className="admin-select"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="admin-section-card">
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Details</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Fulfillment Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersLoading ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="spinner-sm" style={{ margin: '0 auto 0.5rem auto' }} />
                        <span style={{ color: 'var(--color-muted-text)' }}>Loading orders...</span>
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-muted-text)' }}>
                        No orders found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord._id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)' }}>
                          #{ord._id.slice(-8).toUpperCase()}
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--color-foreground)' }}>
                            {ord.user?.name || 'Customer'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-text)' }}>
                            {ord.user?.email || 'N/A'}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)' }}>
                          {new Date(ord.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                          {ord.orderItems?.length || 0} item{(ord.orderItems?.length || 0) !== 1 ? 's' : ''}
                        </td>
                        <td style={{ fontWeight: 800, color: 'var(--color-foreground)', fontSize: '0.95rem' }}>
                          ${Number(ord.totalAmount).toFixed(2)}
                        </td>
                        <td>
                          {ord.isPaid ? (
                            <span className="status-pill status-online" style={{ fontSize: '0.75rem' }}>
                              <CheckCircle size={12} /> Paid
                            </span>
                          ) : (
                            <span className="status-pill status-pending" style={{ fontSize: '0.75rem' }}>
                              <Clock size={12} /> Unpaid
                            </span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <select
                              className="admin-status-select"
                              value={ord.status}
                              disabled={updatingOrderId === ord._id}
                              onChange={(e) => handleOrderStatusChange(ord._id, e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            {updatingOrderId === ord._id && (
                              <span className="spinner-sm" style={{ width: '12px', height: '12px' }} />
                            )}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', gap: '0.3rem' }}
                            onClick={() => setViewOrderModal({ isOpen: true, order: ord })}
                            title="View full order details"
                          >
                            <Eye size={15} /> Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODALS
         ───────────────────────────────────────────────────────────── */}
      {/* Product Form Modal (Add & Edit) */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleProductSubmit}
        product={selectedProduct}
        loading={productFormLoading}
      />

      {/* Confirm Delete Product Modal */}
      <ConfirmModal
        isOpen={deleteProductModal.isOpen}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${deleteProductModal.product?.name}"? This action cannot be undone and will remove it from the catalog.`}
        confirmText="Delete Product"
        cancelText="Keep Product"
        isDestructive={true}
        loading={deleteProductModal.loading}
        onConfirm={handleConfirmDeleteProduct}
        onCancel={() => setDeleteProductModal({ isOpen: false, product: null, loading: false })}
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={viewOrderModal.isOpen}
        onClose={() => setViewOrderModal({ isOpen: false, order: null })}
        order={viewOrderModal.order}
      />
    </div>
  );
}
