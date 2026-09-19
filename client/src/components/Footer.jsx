import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Mail, Phone, MapPin, ShieldCheck, CreditCard, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* BRAND & ABOUT */}
        <div className="footer-col">
          <div className="footer-brand">
            <Store size={22} className="footer-brand-icon" />
            <span>Nexoria</span>
          </div>
          <p className="footer-desc">
            Discover curated electronics, modern accessories, lifestyle essentials, and smart home goods built to elevate your daily life.
          </p>
          <div className="footer-trust-badge">
            <ShieldCheck size={16} />
            <span>Verified Authentic &amp; Stripe Protected</span>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-col">
          <h4 className="footer-heading">Shop Nexoria</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Support</Link></li>
            <li><Link to="/wishlist">My Wishlist</Link></li>
          </ul>
        </div>

        {/* CUSTOMER CARE */}
        <div className="footer-col">
          <h4 className="footer-heading">Customer Care</h4>
          <ul className="footer-links">
            <li><Link to="/cart">Shopping Cart</Link></li>
            <li><Link to="/orders">Track Order</Link></li>
            <li><Link to="/contact">Returns &amp; Warranty</Link></li>
            <li><Link to="/about">Why Shop With Us</Link></li>
            <li><Link to="/products">Shipping Information</Link></li>
          </ul>
        </div>

        {/* CONTACT & SUPPORT */}
        <div className="footer-col">
          <h4 className="footer-heading">Contact &amp; Support</h4>
          <ul className="footer-contact-list">
            <li>
              <Mail size={16} />
              <Link to="/contact" style={{ color: 'inherit' }}>support@nexoriastore.com</Link>
            </li>
            <li>
              <Phone size={16} />
              <span>+1 (800) 555-0199</span>
            </li>
            <li>
              <MapPin size={16} />
              <span>San Francisco, CA 94105</span>
            </li>
            <li>
              <CreditCard size={16} />
              <span>Visa &bull; Mastercard &bull; Stripe</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} Nexoria. All rights reserved.</p>
      </div>
    </footer>
  );
}
