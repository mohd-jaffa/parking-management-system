const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const parkingSlotSchema = new mongoose.Schema(
    {
        slotNumber: {
            type: Number,
            required: [true, "Slot number is required"],
            unique: true,
            min: [1, "Slot number must be greater than 0"],
        },

        slotType: {
            type: String,
            required: true,
            enum: {
                values: ["bike", "car", "truck"],
                message: "Slot type must be bike, car or truck",
            },
            lowercase: true,
            trim: true,
        },

        isOccupied: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        strict: "throw",
    }
)

parkingSlotSchema.plugin(uniqueValidator, {
    message: "This {PATH} is already taken",
})

module.exports = mongoose.model("ParkingSlot", parkingSlotSchema)