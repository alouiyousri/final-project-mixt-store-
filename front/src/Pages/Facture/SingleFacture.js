// src/Pages/SingleFacture/SingleFacture.js
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./SingleFacture.css"; // Import CSS

const SingleFacture = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

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
      });
  }, [orderId, navigate]);

  const handleDownload = async () => {
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${orderId}.pdf`);
  };

  if (error) return <p className="facture-error">{error}</p>;
  if (!order) return <p className="facture-loading">Loading invoice…</p>;

  return (
    <div className="facture-wrapper">
      <div ref={invoiceRef} className="facture-invoice">
        <h2>📄 Invoice #{order._id}</h2>
        <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
        <p>Status: {order.status}</p>

        <h3>👤 Customer</h3>
        <p>Name: {order.customerInfo.name}</p>
        <p>Phone: {order.customerInfo.phone}</p>
        <p>Location: {order.customerInfo.location}</p>

        <h3>🧾 Items</h3>
        <table className="facture-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td>
                  {item.image ? (
                    <img src={item.image} alt="" width="60" />
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
              <td colSpan="4" style={{ textAlign: "right" }}>
                <strong>Total</strong>
              </td>
              <td>
                <strong>${order.total.toFixed(2)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="facture-actions">
        <button onClick={() => navigate(-1)}>⬅ Back</button>
        <button onClick={handleDownload}>⬇️ Download PDF</button>
      </div>
    </div>
  );
};

export default SingleFacture;
