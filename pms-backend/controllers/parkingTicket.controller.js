const mongoose = require("mongoose")
const Vehicle = require("../models/vehicle.model")
const ParkingSlot = require("../models/parkingSlot.model")
const ParkingTicket = require("../models/parkingTicket.model")

exports.createParkingTicket = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { vehicleNumber, vehicleType } = req.body;
        let vehicle = await Vehicle.findOne({ vehicleNumber }).session(session);
        if (vehicle && vehicle.vehicleType !== vehicleType) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: "Vehicle already exists with a different vehicle type" });
        }
        if (!vehicle) {
            vehicle = await Vehicle.create([{ vehicleNumber, vehicleType }], { session });
            vehicle = vehicle[0];
        }
        const activeTicket = await ParkingTicket.findOne({ vehicleNumber: vehicle._id, isActive: true }).session(session);
        if (activeTicket) {
            await session.abortTransaction();
            session.endSession
            return res.status(400).json({ success: false, message: "Vehicle already has active ticket" });
        }
        const parkingSlot =
            await ParkingSlot.findOneAndUpdate({ slotType: vehicleType, isOccupied: false },
                { $set: { isOccupied: true } },
                { new: true, sort: { slotNumber: 1 }, session }
            );
        if (!parkingSlot) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: "No parking slot available" });
        }
        const parkingTicket = await ParkingTicket.create([{ vehicleNumber: vehicle._id, slotNumber: parkingSlot._id }],
            { session }
        );
        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({ success: true, message: "Parking ticket created successfully", parkingTicket: parkingTicket[0] });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ success: false, errors });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};

