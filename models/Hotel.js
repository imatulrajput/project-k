const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    availableRoom: { type: Number, required: true },
    price: { type: Number, required: true },
});

module.exports = mongoose.model("Hotel", HotelSchema);