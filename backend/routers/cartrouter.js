
const cartinfo = require("../controllers/cartcontroller");
const express = require("express");
const requireRole = require("../middlewares/authmiddleware");
const router = express.Router();

router.use(requireRole("customer"));
router.post("/add-to-cart", cartinfo.addToCart);
router.get("/details", cartinfo.getCart);
router.put("/update", cartinfo.updateCart);
router.delete("/delete/:productId", cartinfo.removeFromCart);
router.post("/add_to_cart", cartinfo.addToCart);
router.get("/get_cart/:userId", cartinfo.getCart);
router.put("/update_cart/:userId", cartinfo.updateCart);
router.delete("/remove_from_cart/:userId", cartinfo.removeFromCart);

module.exports = router;