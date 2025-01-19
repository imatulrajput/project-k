const express = require("express");
const { createHotel, getAllHotels, getHotelById, updateHotel ,deleteHotel} = require('../controllers/hotel');
const router = express.Router();


router.post('/', createHotel);
router.get('/', getAllHotels);
router.get('/:id', getHotelById);
router.put('/:id', updateHotel);
router.delete('/:id', deleteHotel)


module.exports = router;