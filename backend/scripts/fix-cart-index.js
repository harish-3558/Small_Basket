require("dotenv").config();
const mongoose = require("mongoose");
require("../models/Cart");

const fixCartIndex = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("Set MONGO_URI in backend/.env before running the cart index migration");
    }
    await mongoose.connect(process.env.MONGO_URI);
    const hasCartCollection = await mongoose.connection.db
        .listCollections({ name: "carts" }, { nameOnly: true })
        .hasNext();
    if (!hasCartCollection) {
        console.log("No cart collection exists yet; no index migration is needed.");
        return;
    }
    const indexes = await mongoose.connection.collection("carts").indexes();
    const productUniqueIndex = indexes.find(
        (index) => index.unique && index.key["products.productId"]
    );
    if (!productUniqueIndex) {
        console.log("No unique product-in-cart index needs removal.");
        return;
    }
    await mongoose.connection.collection("carts").dropIndex(productUniqueIndex.name);
    console.log("Removed the unique product index so different customers can add the same product.");
};

fixCartIndex()
    .catch((error) => {
        console.error("Could not update cart indexes:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
