const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const vehicleSchema = new mongoose.Schema(
    {
        vehicleNumber: {
            type: String,
            required: [true, "Vehicle number is required"],
            trim: true,
            uppercase: true,
            minlength: [4, "Vehicle number is too short"],
            maxlength: [10, "Vehicle number is too long"],
        },

        vehicleType: {
            type: String,
            required: [true, "Vehicle type is required"],
            enum: {
                values: ["bike", "car", "truck"],
                message: "Vehicle type must be bike, car or truck",
            },
            lowercase: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
)

vehicleSchema.plugin(uniqueValidator, {
    message: "This {PATH} is already added",
})

module.exports = mongoose.model("Vehicle", vehicleSchema)