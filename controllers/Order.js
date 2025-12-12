// controllers/order.js
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/product");

// Create order (public) — validates stock, reduces stock atomically
exports.postOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let { items, total, customerInfo } = req.body;

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      total == null
    ) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Invalid order data" });
    }

    // Validate availability
    for (const it of items) {
      const prod = await Product.findById(it.productId).session(session);
      if (!prod) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(404)
          .json({ error: `Product not found: ${it.productId}` });
      }
      const available = prod.stock ?? 0;
      if (available < it.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ error: `Insufficient stock for ${prod.name}` });
      }
    }

    // Deduct stock
    for (const it of items) {
      await Product.findByIdAndUpdate(
        it.productId,
        { $inc: { stock: -Math.abs(Number(it.quantity)) } },
        { session }
      );
    }

    // Normalize items (preserve image and size)
    items = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size || null,
      image: item.image || null,
    }));

    const newOrder = new Order({ items, total, customerInfo });
    await newOrder.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    await session.abortTransaction().catch(() => {});
    session.endSession();
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
