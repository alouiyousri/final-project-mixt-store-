// pages/admin/Facture.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./SingleFacture.css";

const Facture = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) throw new Error("Unauthorized");

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const { data } = await axios.get("/api/orders", config);
        setOrders(data.orders || data);
      } catch (err) {
        setError("Failed to load invoices. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getFilteredOrders = () => {
    let filtered = orders;

    if (filterStatus !== "all") {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  if (loading) {
    return (
      <div className="facture-wrapper">
        <div className="facture-loading-container">
          <div className="spinner"></div>
          <p className="facture-loading">Loading invoices...</p>
        </div>
      </div>
    );
  }

  if (error) return <div className="facture-wrapper"><p className="facture-error">{error}</p></div>;

  return (
    <div className="facture-wrapper">
      <div className="facture-list-container">
        <h2 className="facture-list-title">📄 All Invoices</h2>

        {/* Filters */}
        <div className="facture-filters">
          <div className="facture-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by customer name or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="facture-search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm("")}>
                ✕
              </button>
            )}
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="facture-filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders Count */}
        <p className="facture-count">📊 Showing {filteredOrders.length} invoice(s)</p>

        {filteredOrders.length === 0 ? (
          <div className="facture-empty">
            <p className="empty-icon">📭</p>
            <p className="empty-msg">No invoices found</p>
          </div>
        ) : (
          <div className="facture-grid">
            {filteredOrders.map((order) => (
              <div key={order._id} className="facture-card">
                <div className="facture-card-header">
                  <h3>Invoice #{order._id.slice(-8)}</h3>
                  <span className={`facture-status status-${order.status || "pending"}`}>
                    {order.status || "pending"}
                  </span>
                </div>

                <div className="facture-card-body">
                  <p className="facture-info">
                    <span className="info-icon">📅</span>
                    <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="facture-info">
                    <span className="info-icon">👤</span>
                    <strong>Customer:</strong> {order.customerInfo?.name || "N/A"}
                  </p>
                  <p className="facture-info">
                    <span className="info-icon">📱</span>
                    <strong>Phone:</strong> {order.customerInfo?.phone || "N/A"}
                  </p>
                  <p className="facture-info">
                    <span className="info-icon">📍</span>
                    <strong>Location:</strong> {order.customerInfo?.governorate || "N/A"}
                  </p>
                  <p className="facture-info">
                    <span className="info-icon">📦</span>
                    <strong>Items:</strong> {order.items?.length || 0}
                  </p>
                  <p className="facture-info total">
                    <span className="info-icon">💰</span>
                    <strong>Total:</strong> {order.total?.toFixed(2)} TND
                  </p>
                </div>

                <div className="facture-card-footer">
                  <Link
                    to={`/admin/confirmation/${order._id}`}
                    className="facture-view-btn"
                  >
                    👁️ View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Facture;
