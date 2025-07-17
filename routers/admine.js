const express = require("express");
const router = express.Router();
const { login, getProfile, register } = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");

// Public
router.post("/register", register);
router.post("/login", login);

// Protected
router.get("/profile", isAuth, getProfile);

module.exports = router;
