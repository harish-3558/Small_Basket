
const productinfo = require("../models/Product");

const searchProducts = async (req, res) => {
    try {
        const search = String(req.query.search || req.query.query || "").trim();
        const category = String(req.query.category || "").trim().replace("-", "_");
        const filter = { isAvailable: true, vendorId: { $exists: true } };
        if (search) {
            const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            filter.$or = [
                { name: { $regex: escaped, $options: "i" } },
                { desc: { $regex: escaped, $options: "i" } }
            ];
        }
        if (category && category !== "All") filter.category = category;

        const allowedSortFields = ["createdAt", "name", "price"];
        const sortBy = allowedSortFields.includes(req.query.sortBy) ? req.query.sortBy : "createdAt";
        const sortOrder = String(req.query.order || "desc").toLowerCase() === "asc" ? 1 : -1;
        const products = await productinfo.find(filter)
            .populate({ path: "vendorId", match: { status: "approved" }, select: "storeName" })
            .sort({ [sortBy]: sortOrder });
        const approvedProducts = products.filter((product) => product.vendorId);
        return res.status(200).json({ products: approvedProducts, data: approvedProducts });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { searchProducts };