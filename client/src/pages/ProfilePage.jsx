import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Shield, Package, Heart, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ProfilePage() {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [saving, setSaving] = useState(false);

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1.25rem', background: 'var(--color-muted)', borderRadius: '50%', marginBottom: '1.25rem' }}>
            <User size={48} color="var(--color-muted-text)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Authentication Required</h2>
          <p style={{ color: 'var(--color-muted-text)', marginBottom: '1.5rem' }}>
            Please sign in to view and manage your profile settings.
          </p>
          <Link to="/login" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email cannot be empty.', { title: 'Validation Error' });
      return;
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        toast.error('Current password is required to set a new password.', { title: 'Validation Error' });
        return;
      }
      if (formData.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters.', { title: 'Validation Error' });
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New passwords do not match.', { title: 'Validation Error' });
        return;
      }
    }

    setSaving(true);
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim()
    };

    if (formData.newPassword) {
      payload.currentPassword = formData.currentPassword;
      payload.newPassword = formData.newPassword;
    }

    const result = await updateProfile(payload);
    setSaving(false);

    if (result.success) {
      toast.success(result.message || 'Profile updated successfully!', { title: 'Profile Updated' });
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } else {
      toast.error(result.message || 'Could not update profile', { title: 'Update Failed' });
    }
  };

  return (
    <div className="profile-page" style={{ maxWidth: '800px', margin: '1rem auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.25)',
          borderRadius: '100px', padding: '0.25rem 0.9rem',
          fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--color-primary)',
          marginBottom: '0.75rem', display: 'block', width: 'fit-content'
        }}>Account Settings</span>
        <h1 style={{
          fontFamily: "'Rubik', sans-serif", fontSize: 'clamp(1.75rem, 5vw, 2.4rem)',
          fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '0.5rem'
        }}>My Account</h1>
        <p style={{ color: 'var(--color-muted-text)' }}>
          Manage your personal details, security credentials, and account settings.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* ACCOUNT SUMMARY CARD */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--color-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.5rem'
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{user?.name}</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)' }}>{user?.email}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--color-muted-text)' }}>Account Role:</span>
              <span className={`status-pill ${user?.role === 'admin' ? 'status-online' : ''}`} style={{ textTransform: 'capitalize' }}>
                <Shield size={13} /> {user?.role || 'Customer'}
              </span>
            </div>
            {user?.createdAt && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-muted-text)' }}>Member Since:</span>
                <span style={{ fontWeight: 600 }}>{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Link to="/orders" className="btn btn-outline" style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}>
              <Package size={15} /> My Orders
            </Link>
            <Link to="/wishlist" className="btn btn-outline" style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}>
              <Heart size={15} /> Wishlist
            </Link>
          </div>
        </div>

        {/* EDIT PROFILE & SECURITY FORM */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
            Personal Information
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label htmlFor="name" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={15} /> Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={15} /> Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <h3 style={{ fontSize: '1.05rem', marginTop: '0.5rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={15} /> Change Password (Optional)
            </h3>

            <div className="form-group">
              <label htmlFor="currentPassword" style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)', marginBottom: '0.25rem', display: 'block' }}>
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                className="form-input"
                placeholder="Enter current password to change"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword" style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)', marginBottom: '0.25rem', display: 'block' }}>
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" style={{ fontSize: '0.85rem', color: 'var(--color-muted-text)', marginBottom: '0.25rem', display: 'block' }}>
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-input"
                placeholder="Re-type new password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ marginTop: '0.5rem', padding: '0.75rem' }}
            >
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
