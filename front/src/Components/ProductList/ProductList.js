// src/Components/ProductList/ProductList.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../../JS/Action/ProductAction";
import ProductCard from "../ProductCard/ProductCard";
import "./ProductList.css";

const ProductList = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    products = [],
    loading,
    error,
  } = useSelector((state) => state.product);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Update selected category when URL changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      console.log('🔍 Category from URL:', categoryFromUrl);
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  // Debug: Log filtering
  useEffect(() => {
    if (selectedCategory !== "all") {
      console.log('🎯 Filtering by category:', selectedCategory);
      console.log('📦 Total products:', products.length);
      const matches = products.filter((p) =>
        p.category &&
        p.category.toUpperCase() === selectedCategory.toUpperCase()
      );
      console.log('✅ Matching products:', matches.length, matches.map(p => p.name));
    }
  }, [selectedCategory, products]);

  // Fixed categories
  const categories = [
    "all",
    "T-SHIRT",
    "DRESS",
    "TROUSERS",
    "GYM SUITS",
    "SHOES",
    "ACCESSORIES"
  ];

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSortBy("newest");
    setPriceRange([0, 1000]);
    setSearchParams({});
  };

  // Apply filters
  let filteredProducts = products;

  // Search filter
  if (search) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Category filter
  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter((p) =>
      p.category &&
      p.category.toUpperCase() === selectedCategory.toUpperCase()
    );
  }

  // Price range filter
  filteredProducts = filteredProducts.filter((p) =>
    p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name-az":
        return a.name.localeCompare(b.name);
      case "name-za":
        return b.name.localeCompare(a.name);
      case "newest":
      default:
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
  });

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h2 className="product-list-title">Our Collection</h2>
        <p className="product-count">{sortedProducts.length} {sortedProducts.length === 1 ? 'item' : 'items'}</p>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="product-search"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="clear-search" onClick={() => setSearch("")}>✕</button>
        )}
      </div>

      {/* Filters & Sort Section */}
      <div className="filters-section">
        <button
          className="toggle-filters-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters ▲" : "Show Filters ▼"}
        </button>

        <div className={`filters-container ${showFilters ? 'show' : ''}`}>
          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-label">📂 Category</label>
            <div className="category-pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat === "all" ? "All" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Filter */}
          <div className="filter-group">
            <label className="filter-label">🔄 Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-az">Name: A-Z</option>
              <option value="name-za">Name: Z-A</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <label className="filter-label">💰 Price Range</label>
            <div className="price-range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                className="price-input"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                className="price-input"
              />
            </div>
            <div className="price-range-display">
              ${priceRange[0]} - ${priceRange[1]}
            </div>
          </div>

          {/* Clear Filters */}
          <button className="clear-filters-btn" onClick={clearFilters}>
            🔄 Clear All Filters
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading products...</p>
        </div>
      ) : error ? (
        <p className="error-text">❌ {error}</p>
      ) : sortedProducts.length === 0 ? (
        <div className="no-result-container">
          <p className="no-result-icon">😔</p>
          <p className="no-result-text">No products match your filters</p>
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;

