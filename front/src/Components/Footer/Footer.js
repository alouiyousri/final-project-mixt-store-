import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Assuming you have a CSS file for styling

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div>
        <p>&copy; {year} My E-Commerce Store. All rights reserved.</p>
      </div>
      <div>
        <nav>
          <Link to="/">Home</Link> |{" "}
          <Link to="/products">Products</Link> |{" "}
          <Link to="/basket">Basket</Link> |{" "}
          <Link to="/order">Order</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
