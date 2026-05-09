const mongoose = require("mongoose")
const Counter = require("./counter.model")

const parkingTicketSchema = new mongoose.Schema(
    {
        ticketNumber: {
            type: String,
            unique: true,
            trim: true,
        },

        vehicleNumber: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: [true, "Vehicle _id is required"],
            validate: {
                validator: function (value) {
                    return mongoose.Types.ObjectId.isValid(value);
                },
                message: "Vehicle id must be a valid ObjectId",
            },
        },

        slotNumber: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ParkingSlot",
            required: [true, "Parking slot _id is required"],
            validate: {
                validator: function (value) {
                    return mongoose.Types.ObjectId.isValid(value);
                },
                message: "Parking slot id must be a valid ObjectId",
            },
        },

        entryTime: {
            type: Date,
            default: Date.now,
            required: true,
        },

        exitTime: {
            type: Date,
            validate: {
                validator: function (value) {
                    if (!value) return true;
                    return value >= this.entryTime;
                },
                message: "Exit time cannot be before entry time",
            },
        },

        amount: {
            type: Number,
            default: 0,
            min: [0, "Amount cannot be negative"],
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        strict: "throw",
    }
)

parkingTicketSchema.pre("save", async function (next) {
    if (!this.ticketNumber) {
        const counter = await Counter.findOneAndUpdate(
            {
                name: "parkingTicket",
            },
            {
                $inc: {
                    counterValue: 1,
                },
            },
            {
                new: true,
                upsert: true,
            }
        )
        this.ticketNumber = String(
            counter.counterValue
        ).padStart(4, "0")
    }
    next();
})

module.exports = mongoose.model("ParkingTicket", parkingTicketSchema)