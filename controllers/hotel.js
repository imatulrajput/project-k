const Hotel = require("../models/Hotel")

creatseHotel = async (req, res) => {
    try {
        const { name, phone, address, city, state, availableRoom, price } = req.body;

        const newHotel = new Hotel({ name, phone, address, city, state, availableRoom, price });
        await newHotel.save();
        res.status(201).json({ success: true, message: 'Hotel created successfully', data: newHotel });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error creating hotel', error: error.message });
    }
};

getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json({ success: true, data: hotels });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching hotels', error: error.message });
    }
};

getHotelById = async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel.findById(id);
        if (!hotel) {
            return res.status(404).json({ success: false, message: 'Hotel not found' });
        }
        res.status(200).json({ success: true, data: hotel });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching hotel', error: error.message });
    }
};
s
updateHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedHotel = await Hotel.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedHotel) {
            return res.status(404).json({ success: false, message: 'Hotel not found' });
        }
        res.status(200).json({ success: true, message: 'Hotel updated successfully', data: updatedHotel });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating hotel', error: error.message });
    }
};

deleteHotel = async (req, res) => {
    try {s
        const { id } = req.params;
        const deletedHotel = await Hotel.findByIdAndDelete(id);
        if (!deletedHotel) {
            return res.status(404).json({ success: false, message: 'Hotel not found' });
        }
        res.status(200).json({ success: true, message: 'Hotel deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting hotel', error: error.message });
    }
};
module.exports = { createHotel, getAllHotels, getHotelById, updateHotel, deleteHotel }