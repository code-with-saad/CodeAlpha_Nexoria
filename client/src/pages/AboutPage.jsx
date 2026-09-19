import React from 'react';
import { Link } from 'react-router-dom';
import { Store, ShieldCheck, Truck, Award, Sparkles, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="about-page" style={{ maxWidth: '960px', margin: '1rem auto' }}>
      {/* HERO / STORY SECTION */}
      <div
        className="card"
        style={{
          padding: '3.5rem 2.5rem',
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.08) 0%, rgba(234, 88, 12, 0.05) 100%)',
          borderTop: '5px solid var(--color-primary)',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--color-muted)', borderRadius: '50%', marginBottom: '1.25rem' }}>
          <Store size={40} color="var(--color-primary)" />
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-foreground)' }}>
          Curated Essentials for Modern Living
        </h1>
        <p style={{ color: 'var(--color-muted-text)', fontSize: '1.15rem', maxWidth: '720px', margin: '0 auto 1.5rem', lineHeight: 1.7 }}>
          At Nexoria, we believe that great design and dependable utility should seamlessly intersect. We bring together high-performance electronics, thoughtfully crafted accessories, and lifestyle essentials into one unified shopping experience.
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
