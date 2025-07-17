// src/Pages/EditProduct/EditProduct.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./editProduct.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data.product);
        setForm({
          name: data.product.name,
          description: data.product.description,
          price: data.product.price,
        });
      } catch {
        toast.error("❌ Could not fetch product");
      }
    })();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => setImages(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("price", form.price);
    images.forEach((img) => fd.append("images", img));

    try {
      await axios.put(`/api/products/edit/${id}`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      toast.success("✅ Product updated");
      setTimeout(() => navigate("/products"), 1500);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.msg || "❌ Update failed – please try again"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!product) return <p className="loading-text">Loading…</p>;

  return (
    <div className="edit-wrapper">
      <h2 className="edit-title">✏️ Edit Product</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          step="0.01"
          placeholder="Price"
          required
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Updating…" : "Update"}
        </button>
      </form>

      {product.images?.length > 0 && (
        <div className="current-images">
          <h4>Current Images</h4>
          <div className="image-preview-grid">
            {product.images.map((img, i) => (
              <img key={i} src={img.url} alt="existing" />
            ))}
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default EditProduct;
