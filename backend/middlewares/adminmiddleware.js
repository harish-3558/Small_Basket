
const jwt = require("jsonwebtoken");
const admininfo = require("../models/Admin");
const dotenv = require("dotenv");
dotenv.config();

const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if(!token) {
            return res.status(401).json({message: "No token provided"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await admininfo.findById(decoded.id);
        if(!admin) {
            return res.status(401).json({message: "Admin not found"});
        }
        req.admin = admin;
        next();
    }
    catch (error) {
        res.status(401).json({message: "Unauthorized"});
    }
};

module.exports = adminAuth;