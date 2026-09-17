import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const ToastContext = createContext(null);

// Individual Toast Item with Pause-on-Hover support
function ToastItem({ toast, onRemove }) {
  const [isHovered, setIsHovered] = useState(false);
  const remainingTimeRef = useRef(toast.duration || 4000);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);

  const startTimer = (duration) => {
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      onRemove(toast.id);
    }, duration);
  };

  useEffect(() => {
    startTimer(remainingTimeRef.current);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(500, remainingTimeRef.current - elapsed);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    startTimer(remainingTimeRef.current);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div
      className={`toast-item toast-${toast.type || 'info'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
      aria-live="polite"
    >
      <div className="toast-content">
        <span className="toast-icon">{getIcon(toast.type)}</span>
        <div className="toast-text">
          {toast.title && <strong className="toast-title">{toast.title}</strong>}
          <p className="toast-message">{toast.message}</p>
        </div>
        <button
          className="toast-close-btn"
          onClick={() => onRemove(toast.id)}
          aria-label="Close notification"
        >
          &times;
        </button>
      </div>

      {/* Visual countdown progress bar that pauses on hover */}
      <div className="toast-progress-track">
        <div
          className="toast-progress-bar"
          style={{
            animationDuration: `${toast.duration || 4000}ms`,
            animationPlayState: isHovered ? 'paused' : 'running'
          }}
        />
      </div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = (message, type = 'info', options = {}) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 7);
    const newToast = {
      id,
      message,
      type,
      duration: options.duration || 4000,
      title: options.title || null
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  };

  const toast = {
    success: (msg, opts) => addToast(msg, 'success', opts),
    error: (msg, opts) => addToast(msg, 'error', opts),
    warning: (msg, opts) => addToast(msg, 'warning', opts),
    info: (msg, opts) => addToast(msg, 'info', opts),
    dismiss: removeToast
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container" aria-label="Notifications">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
