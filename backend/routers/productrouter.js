
const express = require("express");
const router = express.Router();
const productinfo = require("../controllers/productcontroller");

const upload = require("../middlewares/imagemiddleware");

const requireRole = require("../middlewares/authmiddleware");

const searchcontroller = require("../controllers/searchcontroller");

router.get("/search", searchcontroller.searchProducts);
router.get("/all-products", productinfo.getAllProducts);
router.get("/get_all", productinfo.getAllProducts);
router.get("/vendor/mine", requireRole("vendor", { requireApproved: true }), productinfo.getVendorProducts);
router.get("/:productId", productinfo.getProductById);
router.post("/create", requireRole("vendor", { requireApproved: true }), upload.single("image"), productinfo.createProduct);

module.exports = router;
