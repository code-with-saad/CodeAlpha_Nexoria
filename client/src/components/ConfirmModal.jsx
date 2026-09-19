import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
  loading = false
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onCancel();
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
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="admin-modal-backdrop"
      onClick={() => {
        if (!loading) onCancel();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="admin-modal-card admin-confirm-dialog"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div className="admin-confirm-header">
          <div className="admin-confirm-icon-wrap" style={{ background: isDestructive ? 'rgba(220, 38, 38, 0.12)' : 'var(--color-primary-light)' }}>
            <AlertTriangle
              size={24}
              color={isDestructive ? 'var(--color-destructive)' : 'var(--color-primary)'}
            />
          </div>
          <div style={{ flex: 1 }}>
            <h3 id="confirm-modal-title" style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--color-foreground)' }}>
              {title}
            </h3>
            <p style={{ marginTop: '0.4rem', fontSize: '0.9rem', color: 'var(--color-muted-text)', lineHeight: 1.5, margin: '0.4rem 0 0 0' }}>
              {message}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={loading}
            style={{ padding: '0.4rem', alignSelf: 'flex-start' }}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="admin-modal-actions" style={{ marginTop: '1.5rem', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
            disabled={loading}
            style={{ minWidth: '90px' }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={isDestructive ? 'btn btn-destructive' : 'btn btn-primary'}
            onClick={onConfirm}
            disabled={loading}
            style={{ minWidth: '100px' }}
          >
            {loading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="spinner-sm" /> Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
