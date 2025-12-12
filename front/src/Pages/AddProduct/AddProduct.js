// src/Pages/AddProduct/AddProduct.js
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddProduct.css";

const CATEGORIES = [
  "t-shirt",
  "dress",
  "trousers",
  "gym suits",
];

const AddProduct = () => {
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFiles(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, description, price } = form;
    if (!name || !description || !price || !category) {
      toast.warn("Please fill in all fields");
      setLoading(false);
      return;
    }

    const fd = new FormData();
    fd.append("name", name);
    fd.append("description", description);
    fd.append("price", price);
    fd.append("size", size);
    fd.append("category", category);
    fd.append("stock", quantity);

    files.forEach((f) => fd.append("images", f));

    try {
      await axios.post("/api/products/addproduct", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      toast.success("Product created successfully 🎉");
      setForm({ name: "", description: "", price: "" });
      setFiles([]);
      setSize("");
      setCategory("");
      setQuantity(1);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-wrapper">
      <div className="add-product-container">
        <h2 className="add-product-title">✨ Add New Product</h2>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="add-product-form"
        >
          <div>
            <label className="add-product-label">🏷️ Product Name</label>
            <input
              name="name"
              placeholder="Enter product name"
              value={form.name}
              onChange={handleChange}
              required
              className="add-product-input"
            />
          </div>

          <div>
            <label className="add-product-label">📝 Description</label>
            <textarea
              name="description"
              placeholder="Describe your product..."
              value={form.description}
              onChange={handleChange}
              required
              className="add-product-textarea"
            />
          </div>

          <div>
            <label className="add-product-label">💰 Price (TND)</label>
            <input
              type="number"
              name="price"
              step="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={handleChange}
              required
              className="add-product-input"
            />
          </div>

          <div>
            <label className="add-product-label">📏 Size</label>
            <input
              type="text"
              placeholder="S, M, L or 42, 43..."
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="add-product-input"
            />
          </div>

          <div>
            <label className="add-product-label">🗂️ Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="add-product-select"
            >
              <option value="">-- Select Category --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="add-product-label">📦 Quantity (Stock)</label>
            <input
              type="number"
              placeholder="Available quantity"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="add-product-input"
              required
            />
          </div>

          <div>
            <label className="add-product-label">📸 Product Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="add-product-file"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="add-product-button">
            {loading ? "⏳ Uploading..." : "✨ Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
