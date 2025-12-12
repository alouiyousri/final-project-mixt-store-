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
    return (
      <div className="confirmation-wrapper">
        <p className="error-message">{error}</p>
      </div>
    );
  if (!order)
    return (
      <div className="confirmation-wrapper">
        <p className="loading-message">Loading order details…</p>
      </div>
    );

  const imgSrc = (item) =>
    item.image ||
    item.img ||
    (item.images && item.images[0] && item.images[0].url) ||
    "";

  return (
    <div className="confirmation-wrapper">
      <div className="confirmation-container">
        <h2 className="confirmation-title">✅ Order Confirmation  #{order._id.slice(-8).toUpperCase()}</h2>

        <div className="customer-info">
          <h3 style={{ color: '#d63384', marginBottom: '15px', fontSize: '1.3em' }}>👤 Customer Information</h3>
          <p><strong>📛 Name:</strong> {order.customerInfo?.name || 'N/A'}</p>
          <p><strong>📱 Phone:</strong> {order.customerInfo?.phone || 'N/A'}</p>
          <p><strong>📍 Governorate:</strong> {order.customerInfo?.governorate || order.customerInfo?.location || 'N/A'}</p>
          <p><strong>🏘️ Municipality:</strong> {order.customerInfo?.municipality || 'N/A'}</p>
          <p><strong>🏠 Address:</strong> {order.customerInfo?.address || 'N/A'}</p>
          <p><strong>📊 Status:</strong> <span style={{
            padding: '4px 12px',
            borderRadius: '15px',
            background: order.status === 'completed' ? '#d1e7dd' : order.status === 'pending' ? '#fff3cd' : '#cfe2ff',
            color: order.status === 'completed' ? '#0a3622' : order.status === 'pending' ? '#856404' : '#084298',
            fontWeight: '600'
          }}>{order.status || 'pending'}</span></p>
          <p><strong>📅 Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        <h3 className="items-title">🧾 Order Items</h3>
        <table className="confirmation-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Size</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Subtotal</th>
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
                    <div style={{
                      width: '70px',
                      height: '70px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f0f0f0',
                      borderRadius: '10px',
                      fontSize: '2em'
                    }}>📦</div>
                  )}
                </td>
                <td style={{ fontWeight: '500' }}>{item.name}</td>
                <td>{item.size || '-'}</td>
                <td>{item.quantity}</td>
                <td>{item.price.toFixed(2)} TND</td>
                <td style={{ fontWeight: '600', color: '#d63384' }}>{(item.price * item.quantity).toFixed(2)} TND</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="5" className="total-label">
                <strong>TOTAL AMOUNT</strong>
              </td>
              <td className="total-value">
                <strong>{order.total.toFixed(2)} TND</strong>
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="button-group">
          <button
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ⬅️ Back to Orders
          </button>
          <button
            className="facture-button"
            onClick={() => navigate(`/admin/facture/${order._id}`)}
          >
            📄 View Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
