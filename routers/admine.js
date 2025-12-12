const express = require("express");
const router = express.Router();
const { login, getProfile, register } = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");
const {
  registerValidation,
  loginValidation,
  validation,
} = require("../middleware/validation");

// Public
router.post("/register", registerValidation(), validation, register);
router.post("/login", loginValidation(), validation, login);

// Protected
router.get("/profile", isAuth, getProfile);

module.exports = router;
