// server.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/connectdb");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan("dev")); // Logging

// Routes
const productRoutes = require("./routers/product");
const orderRoutes = require("./routers/order");
const adminRoutes = require("./routers/admine");

app.use("/api/products", productRoutes); // Product routes
app.use("/api/orders", orderRoutes);     // Order routes
app.use("/api/admin", adminRoutes);      // Admin routes

// Serve uploaded images (Cloudinary handles remote uploads, this is for local backups if needed)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/", (req, res) => {
  res.send("🟢 API is running ...");
});

// Error handler middleware (optional, improves error visibility)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
