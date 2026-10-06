const express = require("express");
const requireRole = require("../middlewares/authmiddleware");
const orders = require("../controllers/ordercontroller");

const router = express.Router();
router.post("/", requireRole("customer"), orders.placeOrder);
router.get("/my", requireRole("customer"), orders.getCustomerOrders);
router.get("/vendor", requireRole("vendor", { requireApproved: true }), orders.getVendorOrders);
router.patch("/vendor/:orderId/items/:itemId", requireRole("vendor", { requireApproved: true }), orders.fulfillOrderItem);

module.exports = router;
