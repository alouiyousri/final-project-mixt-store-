// src/Components/NavBar/NavBar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutAdmin } from "../../JS/Action/AdminAction";
import "./NavBar.css"; // Assuming you have a CSS file for styling
import { toast } from "react-toastify";

const NavBar = () => {
  const navigate     = useNavigate();
  const dispatch     = useDispatch();
  const { adminInfo} = useSelector((state) => state.admin);

  /* ---------- handlers ---------- */
  const handleLogout = () => {
    dispatch(logoutAdmin());
    toast.info("👋 Logged out");
    navigate("/admin/login");
  };

  /* ---------- render ---------- */
  return (
    <nav>
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          padding: 0,
        }}
      >
        {/* universal */}
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>

        {/* basket → only visitors */}
        {!adminInfo && (
          <li><Link to="/basket">Basket</Link></li>
        )}

        {/* admin area */}
        {adminInfo ? (
          <>
            <li><Link to="/admin/profile">Profile</Link></li>
            <li><Link to="/admin/add-product">Add Product</Link></li>
            <li>
              <button onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <li><Link to="/admin/login">Admin Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
