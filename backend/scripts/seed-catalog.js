require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Vendor = require("../models/Vendor");

const stores = [
    {
        name: "Asha",
        storeName: "Green Valley Farm",
        email: "greenvalley@example.com",
        products: [
            ["Tomatoes", 60, "Fresh, ripe tomatoes sourced from a local farm.", "vegetables", "1kg", "photo-1546094096-0df4bcaaa337"],
            ["Spinach", 35, "Tender leafy spinach, picked fresh.", "vegetables", "500g", "photo-1576045057995-568f588f82fb"],
            ["Carrots", 55, "Crunchy, naturally sweet farm-fresh carrots.", "vegetables", "1kg", "photo-1445282768818-728615cc910a"],
            ["Cucumbers", 45, "Cool and crisp cucumbers for salads and snacks.", "vegetables", "1kg", "photo-1604977042946-1eecc30f269e"]
        ]
    },
    {
        name: "Ravi",
        storeName: "Sunrise Orchard",
        email: "sunriseorchard@example.com",
        products: [
            ["Apples", 180, "Crisp orchard apples with a sweet-tart flavour.", "fruits", "1kg", "photo-1560806887-1e4cd0b6cbd6"],
            ["Bananas", 50, "Naturally sweet bananas, perfect for everyday snacks.", "fruits", "1kg", "photo-1571771894821-ce9b6c11b08e"],
            ["Oranges", 95, "Juicy oranges with a bright citrus taste.", "fruits", "1kg", "photo-1547514701-42782101795e"],
            ["Strawberries", 220, "Fragrant, bright red berries from the orchard.", "fruits", "500g", "photo-1464965911861-746a04b4bca6"]
        ]
    },
    {
        name: "Meera",
        storeName: "Harvest Grains Co.",
        email: "harvestgrains@example.com",
        products: [
            ["Basmati Rice", 140, "Aromatic long-grain rice for everyday meals.", "food_grains", "1kg", "photo-1586201375761-83865001e31c"],
            ["Rolled Oats", 110, "Wholesome oats for a warm, filling breakfast.", "food_grains", "500g", "photo-1517673132405-a56a62b18caf"],
            ["Red Lentils", 90, "Protein-rich lentils, cleaned and ready to cook.", "food_grains", "1kg", "photo-1515543904379-3d757afe72e4"],
            ["Chickpeas", 105, "Versatile dried chickpeas for curries and salads.", "food_grains", "1kg", "photo-1515543904379-3d757afe72e4"]
        ]
    }
];

const seedCatalog = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("Set MONGO_URI in backend/.env before seeding the catalog");
    }
    await mongoose.connect(process.env.MONGO_URI);

    let vendorCount = 0;
    let productCount = 0;

    for (const store of stores) {
        const vendor = await Vendor.findOneAndUpdate(
            { email: store.email },
            {
                $set: { status: "approved" },
                $setOnInsert: {
                    name: store.name,
                    storeName: store.storeName,
                    email: store.email,
                    password: await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 12)
                }
            },
            { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
        );
        vendorCount += 1;

        for (const [name, price, desc, category, unit, imageId] of store.products) {
            await Product.updateOne(
                { vendorId: vendor._id, name },
                {
                    $set: {
                        price,
                        desc,
                        category,
                        unit,
                        image: `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=900&q=82`,
                        isAvailable: true
                    },
                    $setOnInsert: {
                        name,
                        vendorId: vendor._id
                    }
                },
                { upsert: true, runValidators: true }
            );
            productCount += 1;
        }
    }

    const [storedVendorCount, storedProductCount] = await Promise.all([
        Vendor.countDocuments({ email: { $in: stores.map((store) => store.email) } }),
        Product.countDocuments({
            vendorId: { $in: await Vendor.find({ email: { $in: stores.map((store) => store.email) } }).distinct("_id") }
        })
    ]);
    console.log(`Sample catalog ready: ${storedVendorCount} approved stores and ${storedProductCount} products (${vendorCount} stores and ${productCount} items seeded or refreshed).`);
};

seedCatalog()
    .catch((error) => {
        console.error("Could not seed sample catalog:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
