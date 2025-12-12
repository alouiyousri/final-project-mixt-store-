// src/Pages/Admin/Profile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    fetchProfileAndOrders();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    calculateStats();
    // eslint-disable-next-line
  }, [orders]);

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
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === "pending").length;
    const completedOrders = orders.filter(o => o.status === "completed").length;

    setStats({ totalOrders, totalRevenue, pendingOrders, completedOrders });
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(`/api/orders/${orderId}`, config);
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      toast.success("Order deleted successfully");
    } catch (err) {
      toast.error("Failed to delete order");
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.put(`/api/orders/${orderId}/status`, { status: newStatus }, config);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error("Status update error:", err);
      toast.error(err.response?.data?.error || "Failed to update order status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.info("Logged out successfully");
    navigate("/admin/login");
  };

  // Filter and sort orders
  const getFilteredOrders = () => {
    let filtered = orders;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    // Search by customer name or order ID
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort orders
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "highest":
          return (b.total || 0) - (a.total || 0);
        case "lowest":
          return (a.total || 0) - (b.total || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-msg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        {/* Header Section */}
        <div className="profile-header">
          <div className="header-content">
            <div className="admin-avatar">👤</div>
            <div className="admin-details">
              <h2 className="profile-title">Admin Dashboard</h2>
              <p className="admin-email">📧 {adminData?.email}</p>
              <p className="admin-role">🛡️ Role: {adminData?.role || "Administrator"}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card total-orders">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="stat-card total-revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>${stats.totalRevenue.toFixed(2)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          <div className="stat-card pending-orders">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{stats.pendingOrders}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat-card completed-orders">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.completedOrders}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to="/admin/add-product" className="action-btn add-product">
            ➕ Add New Product
          </Link>
          <Link to="/products" className="action-btn view-products">
            👗 View All Products
          </Link>
        </div>

        {/* Orders Section */}
        <div className="orders-section">
          <div className="section-header">
            <h3 className="section-title">📋 Order Management</h3>
            <span className="order-count">{filteredOrders.length} orders</span>
          </div>

          {/* Filters and Search */}
          <div className="orders-controls">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by customer name or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm("")}>
                  ✕
                </button>
              )}
            </div>

            <div className="filter-group">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <p className="empty-icon">📭</p>
              <p className="empty-msg">No orders found</p>
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-id">
                      <strong>Order #{order._id.slice(-8)}</strong>
                    </div>
                    <div className={`order-status status-${order.status || "pending"}`}>
                      {order.status || "pending"}
                    </div>
                  </div>

                  <div className="order-body">
                    <div className="order-info">
                      <p className="info-item">
                        <span className="info-icon">👤</span>
                        <strong>Customer:</strong> {order.customerInfo?.name || "N/A"}
                      </p>
                      <p className="info-item">
                        <span className="info-icon">📱</span>
                        <strong>Phone:</strong> {order.customerInfo?.phone || "N/A"}
                      </p>
                      <p className="info-item">
                        <span className="info-icon">📍</span>
                        <strong>Location:</strong> {order.customerInfo?.governorate || "N/A"}
                      </p>
                      <p className="info-item">
                        <span className="info-icon">📦</span>
                        <strong>Items:</strong> {order.items?.length || 0}
                      </p>
                      <p className="info-item total-amount">
                        <span className="info-icon">💰</span>
                        <strong>Total:</strong> ${(order.total || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="order-actions">
                    <Link
                      to={`/admin/confirmation/${order._id}`}
                      className="action-btn-small view-btn"
                    >
                      👁️ View Details
                    </Link>

                    <select
                      value={order.status || "pending"}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="action-btn-small delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

