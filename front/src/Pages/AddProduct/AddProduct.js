// src/Pages/AddProduct/AddProduct.js
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddProduct.css"; // ← Import CSS

const AddProduct = () => {
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFiles(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, description, price } = form;
    if (!name || !description || !price) {
      toast.warn("Please fill in all fields");
      setLoading(false);
      return;
    }

    const fd = new FormData();
    fd.append("name", name);
    fd.append("description", description);
    fd.append("price", price);
    files.forEach((f) => fd.append("images", f)); // backend expects images[]

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
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <h2 className="add-product-title">Add New Product</h2>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="add-product-form"
      >
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="add-product-input"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="add-product-textarea"
        />

        <input
          type="number"
          name="price"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="add-product-input"
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="add-product-file"
        />

        <button type="submit" disabled={loading} className="add-product-button">
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
