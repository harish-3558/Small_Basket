
const emailcontroller = require("../controllers/emailcontroller");

const express = require("express");
const router = express.Router();

router.post("/send-otp", emailcontroller.sendOTP);
router.post("/verify-otp", emailcontroller.verifyOTP);
router.post("/api_otp", emailcontroller.sendOTP);
router.post("/verify_otp", emailcontroller.verifyOTP);

module.exports = router;