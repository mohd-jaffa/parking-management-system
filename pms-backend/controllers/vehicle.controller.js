const Vehicle = require("../models/vehicle.model")
const ParkingTicket = require("../models/parkingTicket.model")
const mongoose = require("mongoose")

exports.getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, count: vehicles.length, vehicles });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

exports.getVehicleTickets = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid vehicle id" });
        }
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: "Vehicle not found" });
        }
        const tickets = await ParkingTicket.find({ vehicleNumber: id })
            .populate("slotNumber", "slotNumber slotType")
            .sort({ createdAt: -1 });
        return res.status(200).json({ success: true, vehicle, count: tickets.length, tickets });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};