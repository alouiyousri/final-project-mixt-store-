// src/Pages/SingleFacture/SingleFacture.js
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import "./SingleFacture.css";

const SingleFacture = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const invoiceRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return navigate("/admin/login");

    axios
      .get(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrder(res.data))
      .catch((err) => {
        console.error(err);
        setError("❌ Could not load invoice.");
        toast.error("Failed to load invoice");
      });
  }, [orderId, navigate]);

  const handleDownload = async () => {
    if (!invoiceRef.current) return;

    try {
      toast.info("Generating PDF...");
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        backgroundColor: "#ffffff"
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${orderId}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`Update order status to ${newStatus}?`)) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (error) return <div className="facture-wrapper"><p className="facture-error">{error}</p></div>;
  if (!order) {
    return (
      <div className="facture-wrapper">
        <div className="facture-loading-container">
          <div className="spinner"></div>
          <p className="facture-loading">Loading invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="facture-wrapper">
      <div ref={invoiceRef} className="facture-invoice">
        <div className="invoice-header">
          <div className="brand-info">
            <h1 className="brand-name">🛍️ MyBrand.DC</h1>
            <p className="brand-tagline">Fashion for Every Woman</p>
          </div>
          <div className="invoice-meta">
            <h2 className="invoice-title">INVOICE</h2>
            <p className="invoice-number">#{order._id.slice(-8).toUpperCase()}</p>
            <p className="invoice-date">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="invoice-status-badge">
          <span className={`status-badge status-${order.status || "pending"}`}>
            {order.status?.toUpperCase() || "PENDING"}
          </span>
        </div>

        <div className="invoice-details">
          <div className="customer-section">
            <h3 className="section-title">👤 Customer Information</h3>
            <div className="info-grid">
              <p><strong>Name:</strong> {order.customerInfo?.name || "N/A"}</p>
              <p><strong>Phone:</strong> {order.customerInfo?.phone || "N/A"}</p>
              <p><strong>Governorate:</strong> {order.customerInfo?.governorate || "N/A"}</p>
              <p><strong>Municipality:</strong> {order.customerInfo?.municipality || "N/A"}</p>
              <p className="full-width"><strong>Address:</strong> {order.customerInfo?.address || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="invoice-items">
          <h3 className="section-title">🧾 Order Items</h3>
          <table className="facture-table">
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
              {order.items?.map((item, i) => (
                <tr key={i}>
                  <td>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="item-image" />
                    ) : (
                      <div className="no-image">📦</div>
                    )}
                  </td>
                  <td className="item-name">{item.name || "N/A"}</td>
                  <td>{item.size || "-"}</td>
                  <td>{item.quantity || 0}</td>
                  <td>{(item.price || 0).toFixed(2)} TND</td>
                  <td className="subtotal">{((item.price || 0) * (item.quantity || 0)).toFixed(2)} TND</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan="5" className="total-label">
                  <strong>TOTAL</strong>
                </td>
                <td className="total-amount">
                  <strong>{(order.total || 0).toFixed(2)} TND</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="invoice-footer">
          <p className="footer-note">Thank you for your purchase! 💖</p>
        </div>
      </div>

      <div className="facture-actions no-print">
        <button onClick={() => navigate(-1)} className="action-btn back-btn">
          ⬅️ Back
        </button>

        <button onClick={handlePrint} className="action-btn print-btn">
          🖨️ Print
        </button>

        <button onClick={handleDownload} className="action-btn download-btn">
          ⬇️ Download PDF
        </button>

        <select
          value={order.status || "pending"}
          onChange={(e) => handleStatusUpdate(e.target.value)}
          className="status-update-select"
          disabled={updating}
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
};

export default SingleFacture;
