
const mongoose = require('mongoose');

const category_enum = [
    "vegetables",
    "fruits",
    "food_grains"
];

const unit_enum = [
    "500g",
    "1kg",
    "2kg",
    "5kg"
];

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    
    category: {
        type: String,
        enum: category_enum
    },
    unit : {
        type: String,
        enum: unit_enum
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true
    },
    image : {
        type: String
    },
    isAvailable : {
        type: Boolean,
        default: true
    }
    
},{timestamps: true});
module.exports = mongoose.model('Product', productSchema);