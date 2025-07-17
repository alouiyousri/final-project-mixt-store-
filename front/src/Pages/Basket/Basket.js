// src/Pages/Basket/Basket.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {
  clearBasket,
  removeFromBasket,
} from "../../JS/Action/basketAction";
import "./Basket.css"; // Import CSS

const Basket = () => {
  const dispatch = useDispatch();
  const basket = useSelector((state) => state.basket.items);

  const [form, setForm] = useState({ name: "", phone: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const calculatedTotal = basket.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRemove = (productId) => {
    dispatch(removeFromBasket(productId));
    toast.info("Item removed from basket", { autoClose: 1500 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (basket.length === 0) {
      toast.error("Basket is empty");
      setLoading(false);
      return;
    }

    try {
      await axios.post("/api/orders", {
        customerInfo: form,
        items: basket,
        total: calculatedTotal,
      });
      dispatch(clearBasket());
      toast.success("Order placed successfully!", { autoClose: 2000 });
      setShowForm(false);
      setForm({ name: "", phone: "", location: "" });
    } catch (err) {
      console.error(err);
      toast.error("Order failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="basket-container">
      <h2 className="basket-title">🛒 Your Basket</h2>

      {basket.length === 0 ? (
        <p className="basket-empty">No items in your basket.</p>
      ) : (
        <ul className="basket-list">
          {basket.map((item) => (
            <li key={item.productId} className="basket-item">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="basket-item-image"
                />
              )}
              <span className="basket-item-name">
                <strong>{item.name}</strong> × {item.quantity} — $
                {(item.price * item.quantity).toFixed(2)}
              </span>
              <button
                onClick={() => handleRemove(item.productId)}
                className="basket-remove-button"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3 className="basket-total">Total: ${calculatedTotal.toFixed(2)}</h3>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          disabled={basket.length === 0}
          className="basket-place-order-button"
        >
          🧾 Place Order
        </button>
      ) : (
        <>
          <hr className="basket-divider" />
          <h3 className="basket-complete-title">🧾 Complete Your Order</h3>
          <form onSubmit={handleSubmit} className="basket-form">
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="basket-input"
            />
            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="basket-input"
            />
            <input
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              required
              className="basket-input"
            />
            <div className="basket-buttons">
              <button
                type="submit"
                disabled={loading}
                className="basket-confirm-button"
              >
                {loading ? "Placing Order..." : "Confirm Order"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="basket-cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Basket;
