// src/Pages/Admin/Profile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Profile.css"; // 🆕 Import modern styles

const Profile = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfileAndOrders();
    // eslint-disable-next-line
  }, []);

  const fetchProfileAndOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return navigate("/admin/login");

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data: admin } = await axios.get("/api/admin/profile", config);
      setAdminData(admin);

      const { data: orderList } = await axios.get("/api/orders", config);
      setOrders(orderList.orders || orderList);
    } catch (err) {
      setError("Failed to load profile or orders. Please login again.");
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(`/api/orders/${orderId}`, config);
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch {
      alert("Failed to delete order.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  if (loading) return <p className="loading-msg">Loading profile...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="profile-container">
      <h2>🛡️ Admin Profile</h2>
      <div className="admin-info">
        <p><strong>Role:</strong> {adminData?.role}</p>
        <p><strong>Email:</strong> {adminData?.email}</p>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <hr />

      <h3>📦 Orders</h3>
      {orders.length === 0 ? (
        <p className="empty-msg">No orders available.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Customer:</strong> {order.customerInfo?.name || "N/A"}</p>
              <p><strong>Total:</strong> ${order.total?.toFixed(2)}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <div className="order-actions">
                <Link to={`/admin/confirmation/${order._id}`} className="view-link">
                  🔍 View
                </Link>
                <button onClick={() => handleDeleteOrder(order._id)} className="delete-btn">
                  ❌ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
