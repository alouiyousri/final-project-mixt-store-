// src/Components/ProductList/ProductList.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../../JS/Action/ProductAction";
import ProductCard from "../ProductCard/ProductCard";
import "./ProductList.css"; // ← Import the CSS

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

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Update selected category when URL changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  // derive categories (auto-updates when products change)
  const categories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
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

  // apply search and category filters
  const searched = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProducts =
    selectedCategory === "all"
      ? searched
      : searched.filter((p) => p.category === selectedCategory);

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Products</h2>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          className="product-search"
          placeholder="Search by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="category-filter">
          <label style={{ marginRight: 8 }}>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat === "all" ? "ALL" : cat.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Loading products…</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="no-result-text">
          No products match that search/category.
        </p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
