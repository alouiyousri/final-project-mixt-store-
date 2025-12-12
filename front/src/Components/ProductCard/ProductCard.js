// src/Components/ProductCard/ProductCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { addToBasket } from "../../JS/Action/basketAction";
import { getProducts } from "../../JS/Action/ProductAction";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { adminInfo } = useSelector((state) => state.admin);

  const imageUrl = product.images?.length > 0 ? product.images[0].url : null;
  const outOfStock = (product.stock ?? 0) <= 0;

  // Visitor‑only handler
  const handleAddToBasket = () => {
    if (outOfStock) {
      toast.error("Out of stock");
      return;
    }

    dispatch(
      addToBasket({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: imageUrl,
        size: product.size || null,
      })
    );

    toast.success(`${product.name} added to basket!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  // Admin‑only handlers
  const handleEdit = () => navigate(`/admin/edit-product/${product._id}`);

  const handleDelete = async () => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`/api/products/delete/${product._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Product deleted");
      dispatch(getProducts());
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err.response?.data?.msg || "❌ Delete failed");
    }
  };

  return (
    <div className="product-card">
      {imageUrl && (
        <img src={imageUrl} alt={product.name} className="product-image" />
      )}

      <div className="product-header">
        <h3 className="product-name">{product.name}</h3>

        {/* Admin-only stock badges */}
        {adminInfo && (
          <>
            {product.stock === 0 && (
              <div className="stock-badge out">❌ Out of stock</div>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <div className="stock-badge low">
                ⚠️ Low stock ({product.stock} left)
              </div>
            )}
          </>
        )}
      </div>

      <p className="product-price">${Number(product.price).toFixed(2)}</p>

      <button onClick={() => navigate(`/description/${product._id}`)}>
        See More
      </button>

      {!adminInfo && (
        <button onClick={handleAddToBasket} disabled={outOfStock}>
          {outOfStock ? "Out of stock" : "Add to Basket"}
        </button>
      )}

      {adminInfo && (
        <div className="admin-actions">
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete} className="delete">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
