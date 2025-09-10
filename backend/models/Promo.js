const mongoose = require("mongoose");

const PromoSchema = new mongoose.Schema({
    name: { type: String, required: true },  
    message: { type: String, required: true },  
    price: { type: Number, required: true }  
}, { timestamps: true });

module.exports = mongoose.model("Promo", PromoSchema);
