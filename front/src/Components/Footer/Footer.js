import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section">
          <h3 className="footer-heading">About MyBrand.DC</h3>
          <p className="footer-description">
            Your trusted destination for women's fashion in Tunisia.
            Quality clothing and dresses delivered to your door.
          </p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link facebook">
              <span className="social-icon">f</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link instagram">
              <span className="social-icon">📷</span>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="social-link tiktok">
              <span className="social-icon">♫</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">🏠 Home</Link></li>
            <li><Link to="/products">👗 Shop</Link></li>
            <li><Link to="/basket">🛒 Cart</Link></li>
            <li><Link to="/products?category=DRESS">New Arrivals</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3 className="footer-heading">Contact Us</h3>
          <ul className="footer-contact">
            <li>📍 Tunisia</li>
            <li>📧 contact@mybrand.tn</li>
            <li>📱 +216 XX XXX XXX</li>
            <li>🕐 Mon-Sat: 9AM-6PM</li>
          </ul>
        </div>
      </div>

      {/* Payment & Delivery */}
      <div className="footer-payment">
        <p className="footer-payment-text">We Accept:</p>
        <div className="footer-payment-icons">
          <span className="payment-icon">💳 Cash on Delivery</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          © {year} MyBrand.DC. All rights reserved. Made with 💖 in Tunisia
        </p>
        <div className="footer-bottom-links">
          <Link to="/privacy">Privacy Policy</Link>
          <span className="footer-divider">|</span>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
