const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Vendor = require("../models/Vendor");
const Admin = require("../models/Admin");

const modelsByRole = {
    customer: User,
    vendor: Vendor,
    admin: Admin
};

const requireRole = (role, options = {}) => async (req, res, next) => {
    const authorization = req.headers.authorization || "";
    const [scheme, token] = authorization.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ message: "Sign in is required" });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return res.status(401).json({ message: "Your session is invalid or has expired. Please sign in again." });
    }
    if (decoded.role && decoded.role !== role) {
        return res.status(403).json({ message: "This account cannot access this area" });
    }

    try {
        const account = await modelsByRole[role].findById(decoded.id);
        if (!account) {
            return res.status(401).json({ message: "Account not found" });
        }
        if (role === "customer" && account.isActive === false) {
            return res.status(403).json({ message: "This account has been disabled" });
        }
        if (role === "vendor" && options.requireApproved && account.status !== "approved") {
            return res.status(403).json({ message: "Your vendor account must be approved before you can do this" });
        }

        req.auth = { id: account._id, role, account };
        return next();
    } catch (error) {
        return next(error);
    }
};

module.exports = requireRole;
