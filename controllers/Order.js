// controllers/order.js
const Order = require("../models/Order");

exports.postOrder = async (req, res) => {
  try {
    let { items, total, customerInfo } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0 || !total) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    // Ensure image field is preserved or set to null
    items = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || null, // ✅ Add image field to DB
    }));

    const newOrder = new Order({ items, total, customerInfo });
    await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to place order",
      details: error.message,
    });
  }
};
// GET /api/orders - Get all orders (admin only)
exports.getOrder = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch orders", details: error.message });
  }
};

// PUT /api/orders/:orderId/status - Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to update order status", details: error.message });
  }
};

// GET /api/orders/:orderId/facture - Return facture/invoice (admin only)
exports.getFacture = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    const facture = {
      orderId: order._id,
      date: order.createdAt,
      customer: order.customerInfo,
      items: order.items,
      total: order.total,
      status: order.status,
    };

    res.status(200).json({ facture });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to get facture", details: error.message });
  }
};

// DELETE /api/orders/:orderId - Delete an order by ID (admin only)
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.orderId);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order" });
  }
};
// GET /api/orders/:orderId - Single order (admin only)
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};
