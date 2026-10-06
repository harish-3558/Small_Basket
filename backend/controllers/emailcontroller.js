const userModel = require("../models/User");
const jwt = require("jsonwebtoken");

const { generateOTP } = require("../email/generate_otp");
const sendOTPEmail = require("../email/send_otp");

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findUserByEmail = async (normalizedEmail) => {
    const exactUser = await userModel.findOne({ email: normalizedEmail });
    if (exactUser) {
        return exactUser;
    }

    return userModel.findOne({
        email: {
            $regex: `^\\s*${escapeRegExp(normalizedEmail)}\\s*$`,
            $options: "i"
        }
    });
};

const getFallbackName = (email) => {
    const [localPart] = email.split("@");
    return localPart || "User";
};

const sendOTP = async (req, res) => {
    try {
        const { name, email } = req.body;
        const normalizedEmail = normalizeEmail(email);
        if (!normalizedEmail) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({ success: false, message: "Invalid email address" });
        }

        const normalizedName = typeof name === "string" ? name.trim() : "";
        let user = await findUserByEmail(normalizedEmail);
        if (!user) {
            user = new userModel({
                name: normalizedName || getFallbackName(normalizedEmail),
                email: normalizedEmail
            });
        } else {
            user.email = normalizedEmail;
            if (!user.name && normalizedName) {
                user.name = normalizedName;
            }
            if (user.isActive === false) {
                return res.status(403).json({ success: false, message: "This customer account has been disabled" });
            }
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();

        try {
            await sendOTPEmail(normalizedEmail, otp);
        } catch (error) {
            console.error("OTP email delivery failed:", error);
            return res.status(502).json({
                success: false,
                message: "OTP email could not be delivered. Please check the mail server configuration and try again."
            });
        }

        res.status(200).json({ success: true, message: "OTP sent successfully", name: user.name });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const normalizedEmail = normalizeEmail(email);
        const normalizedOtp = String(otp || "").trim();
        if (!normalizedEmail || !normalizedOtp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({ success: false, message: "Invalid email address" });
        }

        const user = await findUserByEmail(normalizedEmail);
        if (!user) {
            return res.status(404).json({ success: false, message: "OTP was not requested for this email" });
        }

        const otpExpiryTime = user.otpExpiry ? new Date(user.otpExpiry).getTime() : 0;
        if (!user.otp || String(user.otp).trim() !== normalizedOtp || otpExpiryTime < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        user.email = normalizedEmail;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        const token = jwt.sign({ id: user._id, role: "customer" }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({ success: true, message: "OTP verified successfully", name: user.name, token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { sendOTP, verifyOTP };