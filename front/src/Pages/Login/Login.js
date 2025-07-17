// src/Pages/Login/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ADMIN_LOGIN_SUCCESS } from "../../JS/ActionType/ActionType";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css"; // 🆕 import styles

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = form;

    if (!email || !password) {
      toast.error("Please enter email & password");
      return;
    }

    try {
      setBusy(true);
      const { data } = await axios.post("/api/admin/login", { email, password });

      localStorage.setItem("adminToken", data.token);
      dispatch({ type: ADMIN_LOGIN_SUCCESS, payload: data.admin });

      toast.success("✅ Logged‑in");
      setTimeout(() => navigate("/admin/profile"), 1200);
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-card">
      <h2>Admin Login</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="admin-email">Email</label>
        <input
          id="admin-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="username"
        />

        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
        />

        <button type="submit" disabled={busy}>
          {busy ? "Signing in…" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
