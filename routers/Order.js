const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const isAuth = require("../middleware/isAuth");

// Place a new order (public) — validation temporarily removed
router.post("/", orderController.postOrder);

router.get("/:orderId", isAuth, orderController.getSingleOrder);
// Get all orders (admin)
router.get("/", isAuth, orderController.getOrder);

// Delete an order (admin)
router.delete("/:orderId", isAuth, orderController.deleteOrder);

// Additional route (optional alias for delete)
router.delete("/orders/:orderId", isAuth, orderController.deleteOrder);

// Update order status (admin)
router.put("/:orderId/status", isAuth, orderController.updateOrderStatus);

// Get facture for an order (admin)
router.get("/:orderId/facture", isAuth, orderController.getFacture);

module.exports = router;
