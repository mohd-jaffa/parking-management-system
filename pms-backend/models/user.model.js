const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const uniqueValidator = require("mongoose-unique-validator")

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [3, "Name must be at least 3 characters"],
            maxlength: [30, "Name cannot exceed 30 characters"],
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Invalid email format",
            ],
        },

        role: {
            type: String,
            enum: {
                values: ["admin", "moderator"],
                message: "Invalid role",
            },
            default: "moderator",
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },
    },
    {
        timestamps: true,
        strict: "throw",
    }
)

userSchema.plugin(uniqueValidator, {
    message: "This {PATH} already exists",
})

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        const hashedPassword = await bcrypt.hash(
            this.password, 10
        );
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(
        password,
        this.password
    );
};

module.exports = mongoose.model("User", userSchema)