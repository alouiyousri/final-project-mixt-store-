const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const isAuth = require("../middleware/isAuth");
const { orderValidation, validation } = require("../middleware/validation");

// Public: place a new order
router.post("/", orderValidation(), validation, orderController.postOrder);

// Admin: list all orders
router.get("/", isAuth, orderController.getOrder);

// Admin: get facture for an order
router.get("/:orderId/facture", isAuth, orderController.getFacture);

// Admin: single order
router.get("/:orderId", isAuth, orderController.getSingleOrder);

// Admin: update order status
router.put("/:orderId/status", isAuth, orderController.updateOrderStatus);

// Admin: delete an order
router.delete("/:orderId", isAuth, orderController.deleteOrder);

module.exports = router;
