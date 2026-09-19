import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export default function ContactPage() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields.', { title: 'Validation Error' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/contact', formData);
      toast.success(res.data?.message || 'Your message has been sent successfully! Our support team will get back to you within 24 hours.', {
        title: 'Message Sent'
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      toast.error(err.message || 'Could not send message. Please try again later.', {
        title: 'Submission Failed'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page" style={{ maxWidth: '960px', margin: '1rem auto' }}>
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Contact &amp; Customer Support</h1>
        <p style={{ color: 'var(--color-muted-text)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          Have a question regarding your order, shipping, or warranty? Our dedicated support team is here to assist you.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {/* CONTACT FORM */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} color="var(--color-primary)" />
            Send Us a Message
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Your Name <span style={{ color: 'var(--color-destructive)' }}>*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="e.g. Alex Morgan"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address <span style={{ color: 'var(--color-destructive)' }}>*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="alex@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject" className="form-label">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                className="form-input"
                placeholder="Order Inquiry, Product Question, etc."
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">
                Message <span style={{ color: 'var(--color-destructive)' }}>*</span>
              </label>
              <textarea
                id="message"
                name="message"
                className="form-input"
                rows={5}
                placeholder="How can our support team help you today?"
                value={formData.message}
                onChange={handleChange}
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ padding: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Send size={16} />
              {submitting ? 'Sending Message...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* SUPPORT INFO & OPERATING HOURS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Support Channels</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ padding: '0.65rem', background: 'rgba(5, 150, 105, 0.1)', color: 'var(--color-primary)', borderRadius: 'var(--radius-md)' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', marginBottom: '0.15rem' }}>Email Inquiries</h3>
                  <p style={{ color: 'var(--color-muted-text)', fontSize: '0.875rem' }}>support@nexoriastore.com</p>
                  <p style={{ color: 'var(--color-muted-text)', fontSize: '0.75rem' }}>Response within 24 hours</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ padding: '0.65rem', background: 'rgba(5, 150, 105, 0.1)', color: 'var(--color-primary)', borderRadius: 'var(--radius-md)' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', marginBottom: '0.15rem' }}>Toll-Free Phone</h3>
                  <p style={{ color: 'var(--color-muted-text)', fontSize: '0.875rem' }}>+1 (800) 555-0199</p>
                  <p style={{ color: 'var(--color-muted-text)', fontSize: '0.75rem' }}>Mon–Fri, 9:00 AM – 6:00 PM EST</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ padding: '0.65rem', background: 'rgba(5, 150, 105, 0.1)', color: 'var(--color-primary)', borderRadius: 'var(--radius-md)' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', marginBottom: '0.15rem' }}>Headquarters</h3>
                  <p style={{ color: 'var(--color-muted-text)', fontSize: '0.875rem' }}>500 Howard Street, Suite 400</p>
                  <p style={{ color: 'var(--color-muted-text)', fontSize: '0.875rem' }}>San Francisco, CA 94105</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--color-accent)" />
              Operating Hours
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-muted-text)' }}>Monday – Friday:</span>
                <span style={{ fontWeight: 600 }}>9:00 AM – 6:00 PM EST</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-muted-text)' }}>Saturday:</span>
                <span style={{ fontWeight: 600 }}>10:00 AM – 4:00 PM EST</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-muted-text)' }}>Sunday:</span>
                <span style={{ color: 'var(--color-muted-text)' }}>Closed (Online Support Only)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
