// src/Pages/ErrorPage/ErrorPage.js
import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./Errors.css"; // Assuming you have a CSS file for styling

const ErrorPage = () => {
  const location = useLocation();

  return (
    <div className="error-wrapper">
      <h1 className="error-title">🚫 Error 404</h1>
      <p className="error-message">
        The page <code>{location.pathname}</code> was not found or something went wrong.
      </p>
      <Link to="/" className="error-link">
        ⬅ Go back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
