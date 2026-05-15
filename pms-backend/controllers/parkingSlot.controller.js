const ParkingSlot = require("../models/parkingSlot.model")
const mongoose = require("mongoose")
const { handleError } = require("../utils/errorHandler.utils")

exports.createParkingSlot = async (req, res) => {
    try {
        const parkingSlot = await ParkingSlot.create(req.body);
        return res.status(201).json({ success: true, message: "Parking slot created successfully", parkingSlot });
    } catch (error) {
        return handleError(error, res);
    }
};

exports.deleteParkingSlot = async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            return handleError(Error, res);
        }
        const parkingSlot = await ParkingSlot.findByIdAndUpdate(id, { isDeleted: true }, { new: true, runValidators: true });
        if (!parkingSlot) {
            return res.status(404).json({ success: false, message: "parking slot not found" });
        }
        return res.status(201).json({ success: true, message: "Parking slot soft deleted successfully", parkingSlot });
    } catch (error) {
        return handleError(error, res);
    }
}

exports.restoreParkingSlot = async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            return handleError(Error, res);
        }
        const parkingSlot = await ParkingSlot.findByIdAndUpdate(id, { isDeleted: false }, { new: true, runValidators: true });
        if (!parkingSlot) {
            return res.status(404).json({ success: false, message: "parking slot not found" });
        }
        return res.status(201).json({ success: true, message: "Parking slot restored successfully", parkingSlot });
    } catch (error) {
        return handleError(error, res);
    }
}

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
        return handleError(error, res);
    }
};