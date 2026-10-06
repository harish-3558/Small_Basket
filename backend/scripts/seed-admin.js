require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const seedAdmin = async () => {
    const { MONGO_URI, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
    const email = (process.env.ADMIN_EMAIL || "admin@example.com").trim().toLowerCase();
    if (!MONGO_URI || !ADMIN_PASSWORD) {
        throw new Error("Set MONGO_URI and ADMIN_PASSWORD in backend/.env before seeding an admin");
    }

    await mongoose.connect(MONGO_URI);
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        if (!process.argv.includes("--reset-password")) {
            console.log(`Admin account ${email} already exists; no changes were made.`);
            return;
        }
        existingAdmin.password = await bcrypt.hash(ADMIN_PASSWORD, 12);
        await existingAdmin.save();
        console.log(`Admin password updated for ${email}.`);
        return;
    }

    await Admin.create({
        name: ADMIN_NAME || "Administrator",
        email,
        password: await bcrypt.hash(ADMIN_PASSWORD, 12)
    });
    console.log(`Admin account ${email} created.`);
};

seedAdmin()
    .catch((error) => {
        console.error("Could not seed admin:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
