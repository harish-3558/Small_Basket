
const admininfo = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const {password} = req.body;
        const admin = await admininfo.findOne({email});
        if(!admin) return res.status(401).json({message: "Email or password is incorrect"});
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if(!isPasswordValid) return res.status(401).json({message: "Email or password is incorrect"});
        const token = jwt.sign({id: admin._id, role: "admin"}, process.env.JWT_SECRET, {expiresIn: "1d"});
        res.status(200).json({
            message: "Login successful",
            admin: { id: admin._id, name: admin.name, email: admin.email },
            token
        });
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }   
}

module.exports = {adminLogin};
