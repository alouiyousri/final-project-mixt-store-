// src/Pages/Home/Home.js
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // 🆕 import the CSS

const Home = () => {
  return (
    <div className="home-wrapper">
      <h1 className="home-title">🛍️ Welcome to MixStore</h1>
      <p className="home-subtitle">
        Enjoy browsing and ordering products — no account required!
      </p>

      <div className="home-explore">
        <h3>Explore:</h3>
        <ul>
          <li>
            <Link to="/products" className="home-link">
              🔍 View Products
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
