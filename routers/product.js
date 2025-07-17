const express = require("express");
const upload = require("../utils/multer");
const isAuth = require("../middleware/isAuth");
const {
  addproduct,
  getproducts,
  getproduct,
  deleteproduct,
  editproduct,
} = require("../controllers/product");

const router = express.Router();

// Use multiple images with field name "images"
router.post("/addproduct", isAuth, upload.array("images"), addproduct);
router.put("/edit/:id", isAuth, upload.array("images"), editproduct);
router.delete("/delete/:id", isAuth, deleteproduct);

// Public
router.get("/", getproducts);
router.get("/:id", getproduct);

module.exports = router;
