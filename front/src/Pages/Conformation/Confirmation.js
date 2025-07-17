// src/Pages/Conformation/Confirmation.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Conformation.css"; // Import CSS

const Confirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) return navigate("/admin/login");

        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch order.");
      }
    })();
  }, [orderId, navigate]);

  if (error)
    return <p className="error-message">{error}</p>;
  if (!order)
    return <p className="loading-message">Loading order details…</p>;

  const imgSrc = (item) =>
    item.image ||
    item.img ||
    (item.images && item.images[0] && item.images[0].url) ||
    "";

  return (
    <div className="confirmation-container">
      <h2 className="confirmation-title">✅ Order Confirmation  #{order._id}</h2>

      <div className="customer-info">
        <p><strong>Customer:</strong> {order.customerInfo.name}</p>
        <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
        <p><strong>Location:</strong> {order.customerInfo.location}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <h3 className="items-title">🧾 Items</h3>
      <table className="confirmation-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Unit $</th>
            <th>Subtotal $</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, i) => (
            <tr key={i}>
              <td className="img-cell">
                {imgSrc(item) ? (
                  <img
                    src={imgSrc(item)}
                    alt={item.name}
                    className="item-image"
                  />
                ) : (
                  "—"
                )}
              </td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" className="total-label">
              <strong>Total:</strong>
            </td>
            <td className="total-value">
              <strong>${order.total.toFixed(2)}</strong>
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="button-group">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          🔙 Back
        </button>
        <button
          className="facture-button"
          onClick={() => navigate(`/admin/facture/${order._id}`)}
        >
          📄 View Facture
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
