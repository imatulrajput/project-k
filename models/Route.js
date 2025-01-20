const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true }, // Reference to Bus
  source: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  stops: [
    {
      stopName: { type: String, required: true },
      arrivalTime: { type: String, required: true },
      departureTime: { type: String, required: true },
      priceToNextStop: { type: Number, required: true }, // Price between stops
    },
  ],
  startDate: { type: Date, required: true }, // Start of the active date range
  endDate: { type: Date, required: true }, // End of the active date range
  seatsAvailable: { type: Number, required: true }, // Seats available for this route
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Route", RouteSchema);
