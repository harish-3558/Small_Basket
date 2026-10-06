const Cart = require("../models/Cart");
const Order = require("../models/Order");

const placeOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.auth.id }).populate({
            path: "products.productId",
            populate: { path: "vendorId", select: "status" }
        });
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        const items = cart.products.map(({ productId, quantity }) => {
            if (!productId || !productId.isAvailable || productId.vendorId?.status !== "approved") return null;
            return {
                productId: productId._id,
                vendorId: productId.vendorId._id,
                productName: productId.name,
                unitPrice: productId.price,
                unit: productId.unit || "unit",
                quantity,
                status: "processing"
            };
        });
        if (items.some((item) => !item)) {
            return res.status(409).json({ message: "A product in your cart is no longer available" });
        }

        const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
        const tax = Math.round(subtotal * 0.05);
        const deliveryCharge = subtotal > 500 ? 0 : 40;
        const total = subtotal + tax + deliveryCharge;
        const order = await Order.create({ customerId: req.auth.id, items, subtotal, tax, deliveryCharge, total });
        await Cart.deleteOne({ _id: cart._id });
        return res.status(201).json({ message: "Your order has been placed", order });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getCustomerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.auth.id }).sort({ createdAt: -1 });
        return res.status(200).json({ orders });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getVendorOrders = async (req, res) => {
    try {
        const orders = await Order.find({ "items.vendorId": req.auth.id })
            .populate("customerId", "name email")
            .sort({ createdAt: -1 });
        const vendorOrders = orders.map((order) => ({
            _id: order._id,
            customer: order.customerId,
            createdAt: order.createdAt,
            items: order.items.filter((item) => item.vendorId.toString() === req.auth.id.toString())
        }));
        return res.status(200).json({ orders: vendorOrders });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const fulfillOrderItem = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });
        const item = order.items.id(req.params.itemId);
        if (!item || item.vendorId.toString() !== req.auth.id.toString()) {
            return res.status(404).json({ message: "Order item not found for this vendor" });
        }
        item.status = "fulfilled";
        await order.save();
        return res.status(200).json({ message: "Order item marked fulfilled" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = { placeOrder, getCustomerOrders, getVendorOrders, fulfillOrderItem };
