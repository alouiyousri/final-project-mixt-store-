// pages/admin/Facture.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Facture = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) throw new Error("Unauthorized");

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const { data } = await axios.get("/api/orders", config);
        setOrders(data);
      } catch (err) {
        setError("Failed to load invoices. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading invoices...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>All Orders / Invoices</h2>
      {orders.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id}>
            <h3>Invoice #{order._id}</h3>
            <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Status: {order.status}</p>

            <h4>Customer Information</h4>
            <p>Name: {order.customerInfo.name}</p>
            <p>Phone: {order.customerInfo.phone}</p>
            <p>Address: {order.customerInfo.address}</p>

            <h4>Items</h4>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3">Total:</td>
                  <td>${order.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default Facture;
