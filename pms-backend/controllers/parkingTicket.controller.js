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
        console.log(error);
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ success: false, errors });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.exitVehicle = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;
        const parkingTicket = await ParkingTicket.findOne({ _id: id, isActive: true })
            .populate("vehicleNumber").populate("slotNumber").session(session);
        if (!parkingTicket) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: "Active parking ticket not found" });
        }

        const exitTime = new Date();
        const entryTime = parkingTicket.entryTime;
        const durationInMs = exitTime - entryTime;
        const durationInHours = Math.ceil(durationInMs / (1000 * 60 * 60));
        const vehicleType = parkingTicket.vehicleNumber.vehicleType;

        let amount = 0;
        if (vehicleType === "bike") {
            amount = 10;
            if (durationInHours > 1) {
                amount += (durationInHours - 1) * 5;
            }
        }
        else if (vehicleType === "car") {
            amount = 20;
            if (durationInHours > 1) {
                amount += (durationInHours - 1) * 10;
            }
        }
        else if (vehicleType === "truck") {
            amount = 30;
            if (durationInHours > 1) {
                amount += (durationInHours - 1) * 15;
            }
        }

        parkingTicket.exitTime = exitTime;
        parkingTicket.amount = amount;
        parkingTicket.isActive = false;
        await parkingTicket.save({ session });
        await ParkingSlot.findByIdAndUpdate(parkingTicket.slotNumber._id, { isOccupied: false }, { session });
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({ success: true, message: "Vehicle exit completed successfully", parkingTicket });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getParkingTickets = async (req, res) => {
    try {
        const { id, status } = req.query;
        if (id) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, message: "Invalid ticket id" });
            }
            const parkingTicket = await ParkingTicket.findById(id)
                .populate("vehicleNumber", "vehicleNumber vehicleType")
                .populate("slotNumber", "slotNumber slotType");
            if (!parkingTicket) {
                return res.status(404).json({ success: false, message: "Parking ticket not found" });
            }
            return res.status(200).json({ success: true, parkingTicket });
        }
        const filter = {};
        if (status) {
            if (status !== "active" && status !== "inactive") {
                return res.status(400).json({ success: false, message: "Status must be active or inactive" });
            }
            filter.isActive = status === "active";
        }
        const parkingTickets = await ParkingTicket.find(filter)
            .populate("vehicleNumber", "vehicleNumber vehicleType")
            .populate("slotNumber", "slotNumber slotType")
            .sort({ createdAt: -1 });
        return res.status(200).json({ success: true, count: parkingTickets.length, parkingTickets });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message });
    }
};