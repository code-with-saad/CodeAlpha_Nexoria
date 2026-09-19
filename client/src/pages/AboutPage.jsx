import React from 'react';
import { Link } from 'react-router-dom';
import { Store, ShieldCheck, Truck, Award, Sparkles, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="about-page" style={{ maxWidth: '960px', margin: '1rem auto' }}>

      {/* DARK EDITORIAL HERO — same treatment as homepage flagship hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #010a06 0%, #041a10 60%, #02120b 100%)',
          borderRadius: 'var(--radius-xl, 1.25rem)',
          padding: 'clamp(3rem, 8vw, 5.5rem) clamp(2rem, 6vw, 4rem)',
          marginBottom: '2.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(5,150,105,0.18)'
        }}
      >
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
          width: '420px', height: '420px',
          background: 'radial-gradient(circle, rgba(5,150,105,0.14) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Eyebrow badge */}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(5,150,105,0.12)',
          border: '1px solid rgba(5,150,105,0.35)',
          borderRadius: '100px',
          padding: '0.3rem 1rem',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(110,231,183,0.9)',
          marginBottom: '1.75rem',
          position: 'relative'
        }}>
          <Store size={12} />
          Our Story &amp; Mission
        </span>

        {/* Two-line editorial headline */}
        <h1 style={{
          fontFamily: "'Rubik', sans-serif",
          fontWeight: 900,
          lineHeight: 1.05,
          margin: '0 0 1.5rem',
          position: 'relative'
        }}>
          <span style={{
            display: 'block',
            fontSize: 'clamp(2.4rem, 6vw, 4rem)',
            color: '#ffffff',
            letterSpacing: '-0.02em'
          }}>
            Curated Essentials
          </span>
          <span style={{
            display: 'block',
            fontSize: 'clamp(2.4rem, 6vw, 4rem)',
            letterSpacing: '-0.02em',
            color: 'transparent',
            WebkitTextStroke: '2px #059669',
            textStroke: '2px #059669'
          }}>
            For Modern Living
          </span>
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
          maxWidth: '640px',
          margin: '0 auto',
          lineHeight: 1.75,
          position: 'relative'
        }}>
          At Nexoria, we believe that great design and dependable utility should seamlessly intersect.
          We bring together high-performance electronics, thoughtfully crafted accessories, and lifestyle
          essentials into one unified shopping experience.
        </p>
      </div>

      {/* BRAND STORY & MISSION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(5, 150, 105, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
            <Sparkles size={24} />
          </div>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Our Story</h2>
          <p style={{ color: 'var(--color-muted-text)', lineHeight: 1.6, fontSize: '0.95rem' }}>
            Founded with a passion for minimalism and premium craftsmanship, Nexoria started as an endeavor to eliminate cluttered marketplaces and replace them with a strictly verified selection of tech and everyday carry gear.
          </p>
          <p style={{ color: 'var(--color-muted-text)', lineHeight: 1.6, fontSize: '0.95rem', marginTop: '0.75rem' }}>
            Every item in our catalog is chosen through rigorous quality benchmarks — from high-fidelity acoustics and ergonomic workspaces to rugged mobile accessories.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(234, 88, 12, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--color-accent)' }}>
            <HeartHandshake size={24} />
          </div>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Our Mission</h2>
          <p style={{ color: 'var(--color-muted-text)', lineHeight: 1.6, fontSize: '0.95rem' }}>
            Our mission is simple: empower modern creators, professionals, and tastemakers with authentic products backed by responsive customer support, clear warranties, and transparent pricing.
          </p>
          <p style={{ color: 'var(--color-muted-text)', lineHeight: 1.6, fontSize: '0.95rem', marginTop: '0.75rem' }}>
            We work directly with vetted manufacturers and authorized suppliers to deliver fast fulfillment, secure transactions, and zero-compromise post-purchase care.
          </p>
        </div>
      </div>

      {/* CORE PILLARS / VALUES */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', textAlign: 'center', marginBottom: '2rem' }}>
          Why Customers Choose Nexoria
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <ShieldCheck size={32} color="var(--color-primary)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>100% Authentic</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-text)' }}>
              Direct supplier partnerships guaranteeing genuine products with full manufacturer warranty.
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <Truck size={32} color="var(--color-primary)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Swift Delivery</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-text)' }}>
              Fast tracked dispatch and insured shipping to guarantee your items arrive safely.
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <Award size={32} color="var(--color-primary)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>30-Day Guarantee</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-text)' }}>
              Hassle-free 30-day return policy on all eligible purchases with immediate refund processing.
            </p>
          </div>
        </div>
      </div>

      {/* CTA FOOTER */}
      <div
        className="card"
        style={{
          padding: '2.5rem',
          textAlign: 'center',
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)'
        }}
      >
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Ready to Upgrade Your Setup?</h2>
        <p style={{ color: 'var(--color-muted-text)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Browse our latest arrivals and discover high-grade electronics crafted for endurance.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/products" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
            Explore Catalog <ArrowRight size={17} />
          </Link>
          <Link to="/contact" className="btn btn-outline" style={{ padding: '0.75rem 1.75rem' }}>
            Contact Our Team
          </Link>
        </div>
      </div>
    </div>
  );
}
