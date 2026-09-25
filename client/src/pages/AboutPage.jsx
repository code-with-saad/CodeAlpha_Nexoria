import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Store, ShieldCheck, Truck, Award, Sparkles, HeartHandshake, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function AboutPage() {
  const pageRef = useRef(null);
  useScrollReveal(pageRef);

  return (
    <div className="about-page" ref={pageRef}>

      {/* ── THEME-AWARE EDITORIAL HERO - FULL BLEED ── */}
      <div
        className="flagship-hero"
        style={{
          padding: 'clamp(3.5rem, 8vw, 5.5rem) max(1.5rem, calc((100vw - 1200px) / 2 + 1.5rem)) 3.5rem',
          marginBottom: '3.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
          width: '450px', height: '450px',
          background: 'radial-gradient(circle, rgba(216,67,21,0.12) 0%, rgba(153,101,21,0.08) 50%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Eyebrow badge */}
        <span
          className="eyebrow-badge reveal"
          data-delay="0"
          style={{ marginBottom: '1.75rem' }}
        >
          <Store size={13} />
          OUR STORY &amp; MISSION
        </span>

        {/* Two-line editorial headline */}
        <h1
          className="reveal"
          data-delay="100"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            lineHeight: 1.05,
            margin: '0 0 1.5rem',
            position: 'relative'
          }}
        >
          <span style={{
            display: 'block',
            fontSize: 'clamp(2.4rem, 6vw, 4rem)',
            color: 'var(--color-foreground)',
            letterSpacing: '-0.02em'
          }}>
            Curated Essentials
          </span>
          <span style={{
            display: 'block',
            fontSize: 'clamp(2.4rem, 6vw, 4rem)',
            letterSpacing: '-0.02em',
            color: 'transparent',
            WebkitTextStroke: '2px var(--color-primary)',
          }}>
            For Modern Living
          </span>
        </h1>

        <p
          className="reveal flagship-subtext"
          data-delay="200"
          style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            maxWidth: '640px',
            margin: '0 auto',
            lineHeight: 1.75,
            position: 'relative'
          }}
        >
          At Nexoria, we believe that great design and dependable utility should seamlessly intersect.
          We bring together high-performance electronics, thoughtfully crafted accessories, and lifestyle
          essentials into one unified shopping experience.
        </p>
      </div>

      {/* ── CONTAINER WRAPPER FOR INNER CONTENT ──────────────────────── */}
      <div style={{ padding: '0 max(1.5rem, calc((100vw - 1200px) / 2 + 1.5rem))' }}>

        {/* ── BRAND STORY & MISSION ────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
          <div className="card reveal" data-delay="0" style={{ padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
              <Sparkles size={24} />
            </div>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>Our Story</h2>
            <p style={{ color: 'var(--color-muted-text)', lineHeight: 1.65, fontSize: '0.95rem' }}>
              Founded with a passion for minimalism and premium craftsmanship, Nexoria started as an endeavor
              to eliminate cluttered marketplaces and replace them with a strictly verified selection of tech
              and everyday carry gear.
            </p>
            <p style={{ color: 'var(--color-muted-text)', lineHeight: 1.65, fontSize: '0.95rem', marginTop: '0.75rem' }}>
              Every item in our catalog is chosen through rigorous quality benchmarks, from high-fidelity
              acoustics and ergonomic workspaces to rugged mobile accessories.
            </p>
          </div>

          <div className="card reveal" data-delay="100" style={{ padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--color-secondary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--color-secondary)' }}>
              <HeartHandshake size={24} />
            </div>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>Our Mission</h2>
            <p style={{ color: 'var(--color-muted-text)', lineHeight: 1.65, fontSize: '0.95rem' }}>
              Our mission is simple: empower modern creators, professionals, and tastemakers with authentic
              products backed by responsive customer support, clear warranties, and transparent pricing.
            </p>
            <p style={{ color: 'var(--color-muted-text)', lineHeight: 1.65, fontSize: '0.95rem', marginTop: '0.75rem' }}>
              We work directly with vetted manufacturers and authorized suppliers to deliver fast fulfillment,
              secure transactions, and zero-compromise post-purchase care.
            </p>
          </div>
        </div>

        {/* ── CORE PILLARS / VALUES ─────────────────────────────────────── */}
        <div style={{ marginBottom: '3.5rem' }}>
          <h2 className="reveal" style={{ fontSize: '1.85rem', textAlign: 'center', marginBottom: '2rem', fontFamily: 'var(--font-display)' }}>
            Why Customers Choose Nexoria
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              { Icon: ShieldCheck, title: '100% Authentic', desc: 'Direct supplier partnerships guaranteeing genuine products with full manufacturer warranty.' },
              { Icon: Truck, title: 'Swift Delivery', desc: 'Fast tracked dispatch and insured shipping to guarantee your items arrive safely.' },
              { Icon: Award, title: '30-Day Guarantee', desc: 'Hassle-free 30-day return policy on all eligible purchases with immediate refund processing.' },
            ].map(({ Icon, title, desc }, i) => (
              <div key={title} className="card reveal" data-delay={String(i * 80)} style={{ padding: '1.75rem', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', background: 'var(--color-secondary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--color-secondary)' }}>
                  <Icon size={28} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-text)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA FOOTER ───────────────────────────────────────────────── */}
        <div
          className="card reveal"
          style={{ padding: '3rem 2rem', textAlign: 'center', background: 'var(--color-card)', border: '1px solid var(--color-border)', marginBottom: '3.5rem' }}
        >
          <h2 style={{ fontSize: '1.65rem', marginBottom: '0.5rem' }}>Ready to Upgrade Your Setup?</h2>
          <p style={{ color: 'var(--color-muted-text)', marginBottom: '1.75rem', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 1.75rem' }}>
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

      </div>{/* end container padding */}

    </div>
  );
}
