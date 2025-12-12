import React from "react";
import "./OrderCard.css"; // Assuming you have a CSS file for styling
const OrderCard = ({ order }) => {
  const { customerInfo, total, items, createdAt } = order;

  return (
    <div className="order-card">
      <h4>Order by {customerInfo?.name}</h4>
      <p>
        <strong>Phone:</strong> {customerInfo?.phone}
      </p>
      <p>
        <strong>Location:</strong> {customerInfo?.location}
      </p>
      <p>
        <strong>Total:</strong> ${total.toFixed(2)}
      </p>
      <p>
        <strong>Date:</strong> {new Date(createdAt).toLocaleString()}
      </p>
      <ul>
        {items.map((item, i) => (
          <li key={i}>
            {item.name} {item.size ? `(${item.size})` : ""} x {item.quantity} —
            ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderCard;
