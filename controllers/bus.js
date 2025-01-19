const Bus = require("../models/Bus");
const Route = require("../models/Route");

const createBus = async (req, res) => {
  try {
    const { name, busNumber, seatsAvailable, pricePerSeat } = req.body;

    const bus = new Bus({ name, busNumber, seatsAvailable, pricePerSeat });
    await bus.save();

    res.status(201).json({ message: "Bus created successfully", bus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addRouteToBus = async (req, res) => {
  try {
    const { busId } = req.params;
    const { source, destination, departureTime, arrivalTime, stops } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    const route = new Route({
      bus: busId,
      source,
      destination,
      departureTime,
      arrivalTime,
      stops,
    });

    await route.save();

    // Add the route ID to the bus
    bus.routes.push(route._id);
    await bus.save();

    res.status(201).json({ message: "Route added successfully", route });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
const getAllBusWithRoutes = async (req, res) => {
  try {
    const bus = await Bus.find().populate("routes");

    res.status(200).json(bus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getBusWithRoutes = async (req, res) => {
  try {
    const { busId } = req.params;

    const bus = await Bus.findById(busId).populate("routes");
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    res.status(200).json(bus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { source, destination, departureTime, arrivalTime, stops } = req.body;

    const route = await Route.findByIdAndUpdate(
      routeId,
      { source, destination, departureTime, arrivalTime, stops },
      { new: true, runValidators: true }
    );

    if (!route) return res.status(404).json({ message: "Route not found" });

    res.status(200).json({ message: "Route updated successfully", route });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRoute = async (req, res) => {
  try {
    const { routeId } = req.params;

    const route = await Route.findByIdAndDelete(routeId);
    if (!route) return res.status(404).json({ message: "Route not found" });

    // Remove the route from the bus's routes array
    const bus = await Bus.findById(route.bus);
    if (bus) {
      bus.routes = bus.routes.filter((id) => id.toString() !== routeId);
      await bus.save();
    }

    res.status(200).json({ message: "Route deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createBus, addRouteToBus, getBusWithRoutes, updateRoute, deleteRoute, getAllBusWithRoutes };