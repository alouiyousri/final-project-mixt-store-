// App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import NavBar from "./Components/NavBar/NavBar";
import Footer from "./Components/Footer/Footer";

// Visitor Pages
import Home from "./Pages/Home/Home";
import ProductList from "./Components/ProductList/ProductList";
import Basket from "./Pages/Basket/Basket";
import Description from "./Pages/Descreption/Descreption";
import ErrorPage from "./Pages/Errors/Errors";

// Admin Pages
import AdminLogin from "./Pages/Login/Login";
import AdminProfile from "./Pages/Profile/Profile";
import AddProduct from "./Pages/AddProduct/AddProduct";
import EditProduct from "./Pages/EditProduct/EditProduct";
import Facture from "./Pages/Facture/Facture";
import SingleFacture from "./Pages/Facture/SingleFacture";
import Confirmation from "./Pages/Conformation/Confirmation";

// Redux
import { useSelector } from "react-redux";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Private route for admin
const PrivateRoute = ({ children }) => {
  const { adminInfo } = useSelector((state) => state.admin);
  return adminInfo ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        {/* Visitor Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<Description />} />
        <Route path="/basket" element={<Basket />} />
        {/* Removed /order route */}
        <Route path="/description/:id" element={<Description />} />
        <Route path="*" element={<ErrorPage />} />

        {/* Admin Public Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/profile"
          element={
            <PrivateRoute>
              <AdminProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/edit-product/:id"
          element={
            <PrivateRoute>
              <EditProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/confirmation/:orderId"
          element={
            <PrivateRoute>
              <Confirmation />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/facture"
          element={
            <PrivateRoute>
              <Facture />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/facture/:orderId"
          element={
            <PrivateRoute>
              <SingleFacture />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
