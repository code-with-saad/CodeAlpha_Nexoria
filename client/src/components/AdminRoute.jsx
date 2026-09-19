import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  const toast = useToast();
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin) && !toastShownRef.current) {
      toastShownRef.current = true;
      if (!isAuthenticated) {
        toast.warning('Please sign in with an administrator account to access the Admin Portal.', {
          title: 'Admin Access Required'
        });
      } else {
        toast.error('Access denied: You do not have administrator permissions.', {
          title: 'Unauthorized Access'
        });
      }
    }
  }, [loading, isAuthenticated, isAdmin, toast]);

  if (loading) {
    return (
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '1rem'
        }}
      >
        <div className="skeleton-box" style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-full)' }} />
        <div style={{ color: 'var(--color-muted-text)', fontSize: '0.95rem', fontWeight: 600 }}>
          Verifying administrative credentials...
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
