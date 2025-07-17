// src/Components/ProductCard/ProductCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { addToBasket } from "../../JS/Action/basketAction";
import './ProductCard.css'; // ← Import the CSS

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { adminInfo } = useSelector((state) => state.admin);

  const imageUrl = product.images?.length > 0 ? product.images[0].url : null;

  // Visitor‑only handler
  const handleAddToBasket = () => {
    dispatch(
      addToBasket({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: imageUrl,
      })
    );

    toast.success(`${product.name} added to basket!`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      pauseOnHover: true,
    });
  };

  // Admin‑only handlers
  const handleEdit = () => navigate(`/admin/edit-product/${product._id}`);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`/api/products/delete/${product._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.reload();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Render
  return (
    <div className="product-card">
      {imageUrl && <img src={imageUrl} alt={product.name} />}
      <h3>{product.name}</h3>
      <p>${product.price.toFixed(2)}</p>

      {/* See More Button - Always Visible */}
      <button onClick={() => navigate(`/description/${product._id}`)}>
        See More
      </button>

      {/* Visitor-only Button */}
      {!adminInfo && (
        <button onClick={handleAddToBasket}>Add to Basket</button>
      )}

      {/* Admin-only Buttons */}
      {adminInfo && (
        <>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete} className="delete">
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default ProductCard;
