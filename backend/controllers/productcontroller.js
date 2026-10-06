
const productModel = require("../models/Product");

const createProduct = async (req, res) => {
    try {
        const { name, price, desc, category, unit } = req.body;
        if (!name || !desc || !Number.isFinite(Number(price)) || Number(price) <= 0) {
            return res.status(400).json({ message: "Name, description, and a positive price are required" });
        }

        const image = req.file ? '/uploads/' + req.file.filename : null;
        const product = await productModel.create({
            name: String(name).trim(),
            price: Number(price),
            desc: String(desc).trim(),
            category: category === "food-grains" ? "food_grains" : category,
            unit,
            image,
            isAvailable: req.body.isAvailable !== "false",
            vendorId: req.auth.id
        });
        return res.status(201).json({ product });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find({ isAvailable: true, vendorId: { $exists: true } })
            .populate({ path: "vendorId", match: { status: "approved" }, select: "storeName" })
            .sort({ createdAt: -1 });
        const approvedProducts = products.filter((product) => product.vendorId);
        return res.status(200).json({ products: approvedProducts, data: approvedProducts });
    }
    catch (error) {
        return res.status(500).json({message: error.message});
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await productModel.findOne({
            _id: req.params.productId,
            isAvailable: true,
            vendorId: { $exists: true }
        }).populate({ path: "vendorId", match: { status: "approved" }, select: "storeName" });
        if (!product || !product.vendorId) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json({ record: product, product });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const getVendorProducts = async (req, res) => {
    try {
        const products = await productModel.find({ vendorId: req.auth.id }).sort({ createdAt: -1 });
        return res.status(200).json({ products });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { createProduct, getAllProducts, getProductById, getVendorProducts };
