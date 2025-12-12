// src/Pages/Home/Home.js
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../JS/Action/ProductAction";
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products = [], loading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Log products for debugging
  useEffect(() => {
    if (products.length > 0) {
      console.log('📦 Products loaded:', products.length);
      console.log('📂 Categories found:', [...new Set(products.map(p => p.category))]);
      products.forEach(p => {
        console.log(`  - ${p.name}: category="${p.category}"`);
      });
    }
  }, [products]);

  // Fixed categories that always show
  const allCategories = ["T-SHIRT", "DRESS", "TROUSERS", "GYM SUITS"];

  // Category data with icons and colors
  const categoryData = {
    "t-shirt": { icon: "👕", color: "#2196F3", label: "T-Shirts" },
    "T-SHIRT": { icon: "👕", color: "#2196F3", label: "T-Shirts" },
    "dress": { icon: "👗", color: "#E91E63", label: "Dresses" },
    "DRESS": { icon: "👗", color: "#E91E63", label: "Dresses" },
    "trousers": { icon: "👖", color: "#607D8B", label: "Trousers" },
    "TROUSERS": { icon: "👖", color: "#607D8B", label: "Trousers" },
    "gym suits": { icon: "🏋️‍♀️", color: "#FF5722", label: "Gym Suits" },
    "GYM SUITS": { icon: "🏋️‍♀️", color: "#FF5722", label: "Gym Suits" },
  };

  // Default category styling for unknown categories
  const getDefaultCategory = (category) => ({
    icon: "🛍️",
    color: "#607D8B",
    label: category.charAt(0).toUpperCase() + category.slice(1),
  });

  const handleCategoryClick = (category) => {
    // Navigate to products page with category filter
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="home-wrapper">
      <div className="home-header">
        <h1 className="home-title">🛍️ Welcome to MyBrand.DC</h1>
        <p className="home-subtitle">
          Enjoy browsing and ordering products — no account required!
        </p>
      </div>

      <div className="categories-section">
        <h2 className="categories-title">Shop by Category</h2>

        {loading ? (
          <div className="loading-categories">
            <div className="loader-spinner"></div>
            <p>Loading categories...</p>
          </div>
        ) : (
          <div className="category-grid">
            {allCategories.map((category) => {
              const catKey = category.toLowerCase();
              const catInfo = categoryData[category] || categoryData[catKey] || getDefaultCategory(category);

              // Case-insensitive category matching
              const itemCount = products.filter((p) =>
                p.category && p.category.toUpperCase() === category.toUpperCase()
              ).length;

              return (
                <button
                  key={category}
                  className="category-card"
                  onClick={() => handleCategoryClick(category)}
                  tabIndex={0}
                  aria-label={`Shop ${catInfo.label} category`}
                  style={{ borderColor: catInfo.color }}
                >
                  <div className="category-icon" style={{ color: catInfo.color }}>
                    {catInfo.icon}
                  </div>
                  <h3 className="category-name">{catInfo.label}</h3>
                  <p className="category-count">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                  <div className="category-arrow">→</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="home-cta">
        <Link to="/products" className="view-all-btn">
          🔍 View All Products
        </Link>
      </div>
    </div>
  );
};

export default Home;
