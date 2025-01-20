const Bus = require("../models/Bus");
const Route = require("../models/Route");
const moment = require("moment");
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

const isValidStop = (stop) => {
  return (
    stop.stopName &&
    stop.arrivalTime &&
    stop.departureTime &&
    stop.priceToNextStop !== undefined
  );
};

const addRouteToBus = async (req, res) => {
  try {
    const { busId } = req.params;
    const { source, destination, departureTime, arrivalTime, stops, startDate, endDate, seatsAvailable } = req.body;

    // Validate required fields
    if (!source || !destination || !departureTime || !arrivalTime || !stops || !startDate || !endDate || !seatsAvailable) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate stops
    if (!Array.isArray(stops) || stops.some((stop) => !isValidStop(stop))) {
      return res.status(400).json({
        message: "Each stop must have stopName, arrivalTime, departureTime, and priceToNextStop",
      });
    }

    // Validate date range
    const validStartDate = moment(startDate, "YYYY-MM-DD", true);
    const validEndDate = moment(endDate, "YYYY-MM-DD", true);

    if (!validStartDate.isValid() || !validEndDate.isValid() || validStartDate.isAfter(validEndDate)) {
      return res.status(400).json({ message: "Invalid date range or format (use YYYY-MM-DD)" });
    }

    // Validate bus existence
    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    // Check for duplicate route
    const existingRoute = await Route.findOne({ bus: busId, source, destination });
    if (existingRoute) {
      return res.status(400).json({ message: "Route already exists for this bus" });
    }

    // Create new route
    const route = new Route({
      bus: busId,
      source,
      destination,
      departureTime,
      arrivalTime,
      stops,
      startDate,
      endDate,
      seatsAvailable,
    });

    await route.save();

    // Add the route ID to the bus
    bus.routes.push(route._id);
    await bus.save();

    // Populate bus details
    await route.populate("bus");

    res.status(201).json({ message: "Route added successfully", route });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

const searchBuses = async (req, res) => {
  const { source, destination, date } = req.query;

  try {
    // Parse the date from the query
    const travelDate = new Date(date);

    // Find routes matching source, destination, and within the date range
    const routes = await Route.find({
      "stops.stopName": { $all: [source, destination] }, // Ensure both source and destination exist in stops
      startDate: { $lte: travelDate }, // startDate should be on or before the travel date
      endDate: { $gte: travelDate }, // endDate should be on or after the travel date
    }).populate("bus"); // Populate associated bus details

    const filteredRoutes = routes.map((route) => {
      // Find index of source and destination in the stops array
      const sourceIndex = route.stops.findIndex((stop) => stop.stopName === source);
      const destinationIndex = route.stops.findIndex((stop) => stop.stopName === destination);

      // Only include routes where destination comes after source
      if (sourceIndex < destinationIndex) {
        const price = route.stops
          .slice(sourceIndex, destinationIndex)
          .reduce((total, stop) => total + stop.priceToNextStop, 0); // Calculate price

        return {
          bus: route.bus.name,
          busNumber: route.bus.busNumber,
          source,
          destination,
          departureTime: route.stops[sourceIndex].departureTime,
          arrivalTime: route.stops[destinationIndex].arrivalTime,
          price,
          seatsAvailable: route.seatsAvailable,
        };
      }
    });

    // Filter out undefined routes (in case sourceIndex >= destinationIndex)
    const results = filteredRoutes.filter((route) => route);

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to search buses" });
  }
};

module.exports = { createBus, addRouteToBus, getBusWithRoutes, updateRoute, deleteRoute, getAllBusWithRoutes, searchBuses };