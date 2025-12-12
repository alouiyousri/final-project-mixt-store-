// src/Pages/Description/Description.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Carousel } from "react-bootstrap";
import { addToBasket } from "../../JS/Action/basketAction";
import "./description.css";

const Description = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { adminInfo } = useSelector((state) => state.admin);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [descDraft, setDescDraft] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data.product);
        setDescDraft(data.product.description ?? "");
      } catch {
        setMessage("Failed to load product.");
      }
    })();
  }, [id]);

  const handleAddToBasket = () => {
    if ((product.stock ?? 0) <= 0) {
      setMessage("❌ Out of stock");
      return;
    }

    // Check if requested quantity exceeds stock
    if (quantity > (product.stock ?? 0)) {
      setMessage(`❌ Only ${product.stock} items available`);
      return;
    }

    dispatch(
      addToBasket({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || "",
        quantity,
        size: product.size,
        stock: product.stock || 0, // Pass stock information
      })
    );
    setMessage("✅ Added to basket!");
  };

  const handleSaveDescription = async () => {
    try {
      await axios.put(
        `/api/products/edit/${id}`,
        { description: descDraft },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      setMessage("✅ Description updated.");
      setProduct((prev) => ({ ...prev, description: descDraft }));
    } catch {
      setMessage("❌ Could not update description.");
    }
  };

  const handleAddPictures = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const fd = new FormData();
    files.forEach((f) => fd.append("images", f));

    try {
      setUploading(true);
      await axios.put(`/api/products/edit/${id}`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setMessage("✅ Pictures added!");
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data.product);
    } catch {
      setMessage("❌ Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (!product) return <p className="loading-message">Loading…</p>;

  return (
    <div className="desc-wrapper">
      <h2 className="desc-title">{product.name}</h2>

      {product.images?.length ? (
        <Carousel className="desc-carousel">
          {product.images.map((img, i) => (
            <Carousel.Item key={i}>
              <img
                className="d-block w-100 desc-image"
                src={img.url}
                alt={`slide-${i}`}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <p className="no-images">No images available.</p>
      )}

      {!adminInfo && <p className="desc-text">{product.description}</p>}

      {adminInfo && (
        <>
          <textarea
            className="desc-textarea"
            value={descDraft}
            onChange={(e) => setDescDraft(e.target.value)}
          />
          <button className="save-btn" onClick={handleSaveDescription}>
            💾 Save Description
          </button>
        </>
      )}

      <p className="price">
        <strong>Price:</strong> ${product.price.toFixed(2)}
      </p>

      {/* New product meta */}
      <p>
        <strong>Category:</strong> {product.category || "—"}
      </p>
      <p>
        <strong>Size:</strong> {product.size || "—"}
      </p>
      <p>
        <strong>Stock:</strong>{" "}
        {(product.stock ?? 0) > 0 ? product.stock : "Out of stock"}
      </p>

      {!adminInfo && (
        <>
          <label className="quantity-label">
            Qty&nbsp;
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="quantity-input"
            />
          </label>
          <br />
          <button
            className="add-basket-btn"
            onClick={handleAddToBasket}
            disabled={(product.stock ?? 0) <= 0}
          >
            {(product.stock ?? 0) > 0 ? "Add to Basket" : "Out of Stock"}
          </button>{" "}
          <button className="go-basket-btn" onClick={() => navigate("/basket")}>
            Go to Basket
          </button>
        </>
      )}

      {adminInfo && (
        <>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleAddPictures}
            disabled={uploading}
            className="file-input"
          />
          {uploading && <p className="uploading-text">Uploading…</p>}
        </>
      )}

      {message && <p className="desc-message">{message}</p>}

      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>
    </div>
  );
};

export default Description;
