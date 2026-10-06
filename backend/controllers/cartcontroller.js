const Cart = require("../models/Cart");
const Product = require("../models/Product");

const loadCart = async (userId) => {
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    const products = cart ? cart.products : [];
    return {
        _id: cart?._id,
        userId,
        items: products
            .filter((item) => item.productId)
            .map((item) => ({
                _id: item._id,
                product: item.productId,
                quantity: item.quantity
            }))
    };
};

const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const quantity = Number(req.body.quantity);
        if (!productId || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ message: "A product and a positive whole-number quantity are required" });
        }
        const product = await Product.findOne({
            _id: productId,
            isAvailable: true,
            vendorId: { $exists: true }
        }).populate({ path: "vendorId", match: { status: "approved" } });
        if (!product || !product.vendorId) return res.status(404).json({ message: "Product not found or its vendor is not approved" });

        let cart = await Cart.findOne({ userId: req.auth.id });
        if (!cart) cart = new Cart({ userId: req.auth.id, products: [] });
        const existing = cart.products.find((item) => item.productId.toString() === productId);
        if (existing) existing.quantity += quantity;
        else cart.products.push({ productId, quantity });
        await cart.save();

        return res.status(200).json({ message: "Product added to cart", cart: await loadCart(req.auth.id) });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const getCart = async (req, res) => {
    try {
        return res.status(200).json({ cart: await loadCart(req.auth.id) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const quantity = Number(req.body.quantity);
        if (!productId || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ message: "A product and a positive whole-number quantity are required" });
        }
        const cart = await Cart.findOne({ userId: req.auth.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        const item = cart.products.find((entry) => entry.productId.toString() === productId);
        if (!item) return res.status(404).json({ message: "Product not found in cart" });
        item.quantity = quantity;
        await cart.save();
        return res.status(200).json({ message: "Cart updated", cart: await loadCart(req.auth.id) });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const productId = req.params.productId || req.body.productId;
        if (!productId) return res.status(400).json({ message: "Product id is required" });
        const cart = await Cart.findOne({ userId: req.auth.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        const index = cart.products.findIndex((entry) => entry.productId.toString() === productId);
        if (index === -1) return res.status(404).json({ message: "Product not found in cart" });
        cart.products.splice(index, 1);
        await cart.save();
        return res.status(200).json({ message: "Product removed", cart: await loadCart(req.auth.id) });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = { addToCart, getCart, updateCart, removeFromCart };
