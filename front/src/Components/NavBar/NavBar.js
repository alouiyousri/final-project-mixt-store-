// src/Components/NavBar/NavBar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutAdmin } from "../../JS/Action/AdminAction";
import "./NavBar.css";
import { toast } from "react-toastify";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { adminInfo } = useSelector((state) => state.admin);
  const basket = useSelector((state) => state.basket.items);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const basketItemCount = basket?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleLogout = () => {
    dispatch(logoutAdmin());
    toast.info("👋 Logged out");
    navigate("/admin/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🛍️</span>
          <span className="brand-name">MyBrand.DC</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        {/* Navigation Links */}
        <ul className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>🏠 Home</Link></li>
          <li><Link to="/products" onClick={() => setMobileMenuOpen(false)}>👗 Shop</Link></li>

          {/* Basket - only for visitors */}
          {!adminInfo && (
            <li className="cart-item">
              <Link to="/basket" onClick={() => setMobileMenuOpen(false)}>
                🛒 Cart
                {basketItemCount > 0 && (
                  <span className="cart-badge">{basketItemCount}</span>
                )}
              </Link>
            </li>
          )}

          {/* Admin area */}
          {adminInfo ? (
            <>
              <li><Link to="/admin/profile" onClick={() => setMobileMenuOpen(false)}>👤 Profile</Link></li>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  🚪 Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/admin/login" className="admin-login-link" onClick={() => setMobileMenuOpen(false)}>
                🔐 Admin
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;

