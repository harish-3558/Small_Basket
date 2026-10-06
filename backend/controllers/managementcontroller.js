const User = require("../models/User");
const Vendor = require("../models/Vendor");

const listUsers = async (req, res) => {
    try {
        const users = await User.find().select("name email isActive createdAt").sort({ createdAt: -1 });
        return res.json({ users });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const setUserStatus = async (req, res) => {
    try {
        if (typeof req.body.isActive !== "boolean") {
            return res.status(400).json({ message: "isActive must be true or false" });
        }
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { isActive: req.body.isActive },
            { new: true, runValidators: true }
        ).select("name email isActive");
        if (!user) return res.status(404).json({ message: "Customer not found" });
        return res.json({ user });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const listVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().select("name storeName email status createdAt").sort({ createdAt: -1 });
        return res.json({ vendors });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const setVendorStatus = async (req, res) => {
    try {
        const allowedStatuses = ["approved", "rejected", "suspended"];
        const { status } = req.body;
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Choose approved, rejected, or suspended" });
        }
        const vendor = await Vendor.findByIdAndUpdate(
            req.params.vendorId,
            { status },
            { new: true, runValidators: true }
        ).select("name storeName email status");
        if (!vendor) return res.status(404).json({ message: "Vendor not found" });
        return res.json({ vendor });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = { listUsers, setUserStatus, listVendors, setVendorStatus };
