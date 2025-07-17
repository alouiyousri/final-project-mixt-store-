const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Generate JWT token
const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, role: admin.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// @desc    Register admin
// @route   POST /api/admin/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if already exists
    let existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Admin already exists" });
    }

    const admin = new Admin({ email, password });
    await admin.save();

    res.status(201).json({ msg: "Admin registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = generateToken(admin);

    res.status(200).json({
      token,
      admin: {
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private (requires isAuth middleware)
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
