import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="not-found-page" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <div style={{ display: 'inline-flex', padding: '1.25rem', background: 'var(--color-muted)', borderRadius: '50%', marginBottom: '1.5rem' }}>
        <Search size={48} color="var(--color-primary)" />
      </div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', color: 'var(--color-foreground)' }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--color-muted-text)', maxWidth: '480px', margin: '0 auto 2rem' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
        Back to Home <ArrowRight size={17} />
      </Link>
    </div>
  );
}
