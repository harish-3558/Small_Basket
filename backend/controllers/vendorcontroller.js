const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Vendor = require("../models/Vendor");
const User = require("../models/User");
const Admin = require("../models/Admin");

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const publicVendor = (vendor) => ({
    id: vendor._id,
    name: vendor.name,
    storeName: vendor.storeName,
    email: vendor.email,
    status: vendor.status
});

const registerVendor = async (req, res) => {
    try {
        const name = String(req.body.name || "").trim();
        const storeName = String(req.body.storeName || "").trim();
        const email = normalizeEmail(req.body.email);
        const password = String(req.body.password || "");

        if (!name || !storeName || !email || password.length < 8) {
            return res.status(400).json({
                message: "Name, store name, email, and a password of at least 8 characters are required"
            });
        }

        const [existingVendor, existingUser, existingAdmin] = await Promise.all([
            Vendor.findOne({ email }),
            User.findOne({ email }),
            Admin.findOne({ email })
        ]);
        if (existingVendor || existingUser || existingAdmin) {
            return res.status(409).json({ message: "An account with this email already exists" });
        }

        const vendor = await Vendor.create({
            name,
            storeName,
            email,
            password: await bcrypt.hash(password, 12)
        });
        return res.status(201).json({
            message: "Vendor application submitted. An admin must approve it before you can sign in.",
            vendor: publicVendor(vendor)
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const loginVendor = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        const password = String(req.body.password || "");
        const vendor = await Vendor.findOne({ email }).select("+password");
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({ message: "Email or password is incorrect" });
        }
        if (vendor.status !== "approved") {
            return res.status(403).json({
                message: vendor.status === "pending"
                    ? "Your vendor application is waiting for admin approval"
                    : `Your vendor account is ${vendor.status}`
            });
        }

        const token = jwt.sign({ id: vendor._id, role: "vendor" }, process.env.JWT_SECRET, { expiresIn: "1d" });
        return res.status(200).json({
            message: "Vendor login successful",
            token,
            vendor: publicVendor(vendor)
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { registerVendor, loginVendor };
