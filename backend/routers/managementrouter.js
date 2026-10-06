const express = require("express");
const requireRole = require("../middlewares/authmiddleware");
const management = require("../controllers/managementcontroller");

const router = express.Router();
router.use(requireRole("admin"));
router.get("/users", management.listUsers);
router.patch("/users/:userId", management.setUserStatus);
router.get("/vendors", management.listVendors);
router.patch("/vendors/:vendorId", management.setVendorStatus);

module.exports = router;
