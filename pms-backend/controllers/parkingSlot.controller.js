const ParkingSlot = require("../models/parkingSlot.model")
const mongoose = require("mongoose")

exports.createParkingSlot = async (req, res) => {
    try {
        const parkingSlot = await ParkingSlot.create(req.body);
        return res.status(201).json({ success: true, message: "Parking slot created successfully", parkingSlot });
    } catch (error) {
        console.log(error);
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ success: false, errors });
        }
        return res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

exports.getParkingSlots = async (req, res) => {
    try {
        const { _id } = req.query;
        if (_id) {
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return res.status(400).json({ success: false, message: "Invalid parking slot id" });
            }
            const parkingSlot = await ParkingSlot.findById(_id);
            if (!parkingSlot) {
                return res.status(404).json({ success: false, message: "Parking slot not found" });
            }
            return res.status(200).json({ success: true, parkingSlot });
        }
        const parkingSlots = await ParkingSlot.find().sort({ slotNumber: 1 });
        return res.status(200).json({ success: true, count: parkingSlots.length, parkingSlots });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};