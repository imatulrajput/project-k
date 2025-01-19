const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  busNumber: { type: String, required: true, unique: true }, // Unique bus number
  seatsAvailable: { type: Number, required: true },
  pricePerSeat: { type: Number, required: true },
  routes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Route" }], // Reference to Route
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bus", BusSchema);
