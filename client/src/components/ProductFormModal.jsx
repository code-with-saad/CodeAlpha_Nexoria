import React, { useState, useEffect, useRef } from 'react';
import { X, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Accessories', 'Lifestyle', 'Home'];

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  product = null,
  loading = false
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    stock: '',
    image: '',
    description: '',
    isFeatured: false
  });
  const [errors, setErrors] = useState({});
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || 'Electronics',
        price: product.price !== undefined ? product.price : '',
        stock: product.stock !== undefined ? product.stock : '',
        image: product.image || '',
        description: product.description || '',
        isFeatured: Boolean(product.isFeatured)
      });
      setImagePreviewError(false);
    } else {
      setFormData({
        name: '',
        category: 'Electronics',
        price: '',
        stock: '',
        image: '',
        description: '',
        isFeatured: false
      });
      setImagePreviewError(false);
    }
    setErrors({});
  }, [product, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
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
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = 'Valid price ($) is required (>= 0)';
    }
    if (formData.stock === '' || isNaN(formData.stock) || Number(formData.stock) < 0) {
      newErrors.stock = 'Valid stock count is required (>= 0)';
    }
    if (!formData.image.trim()) {
      newErrors.image = 'Product image URL is required';
    } else if (!/^https?:\/\//i.test(formData.image.trim())) {
      newErrors.image = 'Please provide a valid HTTP/HTTPS image URL';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      category: formData.category.trim(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      image: formData.image.trim(),
      description: formData.description.trim(),
      isFeatured: formData.isFeatured
    });
  };

  return (
    <div
      className="admin-modal-backdrop"
      onClick={() => {
        if (!loading) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="admin-modal-card admin-form-modal"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div className="admin-modal-header">
          <div>
            <div className="admin-modal-tag">
              {product ? 'CATALOG UPDATE' : 'NEW LISTING'}
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0.2rem 0 0 0', color: 'var(--color-foreground)' }}>
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={loading}
            style={{ padding: '0.45rem' }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form-body">
          <div className="admin-form-grid">
            {/* Product Name */}
            <div className="admin-form-group span-2">
              <label className="admin-form-label">
                Product Title <span style={{ color: 'var(--color-destructive)' }}>*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. Nexoria Wireless Noise Cancelling Headphones"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={loading}
              />
              {errors.name && <span className="admin-form-error">{errors.name}</span>}
            </div>

            {/* Category */}
            <div className="admin-form-group">
              <label className="admin-form-label">
                Category <span style={{ color: 'var(--color-destructive)' }}>*</span>
              </label>
              <select
                className={`form-input ${errors.category ? 'input-error' : ''}`}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={loading}
                style={{ cursor: 'pointer' }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <span className="admin-form-error">{errors.category}</span>}
            </div>

            {/* Price */}
            <div className="admin-form-group">
              <label className="admin-form-label">
                Price ($ USD) <span style={{ color: 'var(--color-destructive)' }}>*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className={`form-input ${errors.price ? 'input-error' : ''}`}
                placeholder="99.99"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                disabled={loading}
              />
              {errors.price && <span className="admin-form-error">{errors.price}</span>}
            </div>

            {/* Stock Quantity */}
            <div className="admin-form-group">
              <label className="admin-form-label">
                Stock Quantity <span style={{ color: 'var(--color-destructive)' }}>*</span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                className={`form-input ${errors.stock ? 'input-error' : ''}`}
                placeholder="25"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                disabled={loading}
              />
              {errors.stock && <span className="admin-form-error">{errors.stock}</span>}
            </div>

            {/* Flagship Toggle */}
            <div className="admin-form-group">
              <label className="admin-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={14} color="var(--color-primary)" />
                Flagship Showcase
              </label>
              <label className="admin-toggle-switch">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  disabled={loading}
                />
                <span className="admin-toggle-slider" />
                <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                  {formData.isFeatured ? 'Featured on Flagship' : 'Standard Catalog Item'}
                </span>
              </label>
            </div>

            {/* Image URL */}
            <div className="admin-form-group span-2">
              <label className="admin-form-label">
                Image URL (Unsplash or direct HTTPS) <span style={{ color: 'var(--color-destructive)' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="url"
                    className={`form-input ${errors.image ? 'input-error' : ''}`}
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      setImagePreviewError(false);
                    }}
                    disabled={loading}
                  />
                  {errors.image && <span className="admin-form-error">{errors.image}</span>}
                </div>

                {/* Thumbnail Preview Box */}
                <div className="admin-image-preview-box">
                  {formData.image && !imagePreviewError ? (
                    <img
                      src={formData.image}
                      alt="Preview"
                      onError={() => setImagePreviewError(true)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="admin-image-placeholder">
                      <ImageIcon size={20} color="var(--color-muted-text)" />
                      <span style={{ fontSize: '0.68rem', color: 'var(--color-muted-text)' }}>
                        {imagePreviewError ? 'Broken Link' : 'Preview'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="admin-form-group span-2">
              <label className="admin-form-label">
                Description &amp; Specifications <span style={{ color: 'var(--color-destructive)' }}>*</span>
              </label>
              <textarea
                className={`form-input ${errors.description ? 'input-error' : ''}`}
                rows={4}
                placeholder="Comprehensive technical details, materials, compatibility, and highlights..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
                style={{ resize: 'vertical' }}
              />
              {errors.description && <span className="admin-form-error">{errors.description}</span>}
            </div>
          </div>

          <div className="admin-modal-actions" style={{ marginTop: '1.75rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ minWidth: '130px' }}
            >
              {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className="spinner-sm" /> Saving...
                </span>
              ) : product ? (
                'Save Changes'
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
