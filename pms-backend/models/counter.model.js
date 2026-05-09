const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const counterSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Counter name is required"],
            unique: true,
            enum: {
                values: ["parkingTicket"],
                message: "Invalid counter name",
            },
            trim: true,
        },

        counterValue: {
            type: Number,
            default: 0,
            min: [0, "Counter value cannot be negative"],
            validate: {
                validator: Number.isInteger,
                message: "Counter value must be an integer",
            },
        },
    },
    {
        strict: "throw",
    })

counterSchema.plugin(uniqueValidator, {
    message: "This {PATH} is already created",
})

module.exports = mongoose.model("Counter", counterSchema)