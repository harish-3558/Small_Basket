
const express = require("express");
const router = express.Router();

const admincontroller = require("../controllers/admincontroller");

router.post("/login", admincontroller.adminLogin);

module.exports = router;