const router = require("express").Router();
const {
  createBus,
  addRouteToBus,
  getBusWithRoutes,
  updateRoute,
  deleteRoute,
  getAllBusWithRoutes
} = require("../controllers/bus");


// Bus routes
router.post("/", createBus);
router.get("/", getAllBusWithRoutes);
router.get("/:busId", getBusWithRoutes);


// Route-specific endpoints
router.post("/:busId/routes", addRouteToBus);
router.put("/routes/:routeId", updateRoute);
router.delete("/routes/:routeId", deleteRoute);

module.exports = router;
