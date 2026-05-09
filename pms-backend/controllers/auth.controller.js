const User = require("../models/user.model")
const jwt = require("jsonwebtoken")
const { handleError } = require("../utils/errorHandler.utils")

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUsersCount = await User.countDocuments();
        let role = "moderator";
        if (existingUsersCount === 0) {
            role = "admin";
        }
        const user = await User.create({ name, email, password, role });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        return handleError(error, res);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        const token = jwt.sign({ userId: user._id, role: user.role },
            process.env.JWT_SECRET, { expiresIn: "7d" }
        );
        res.status(200).json({
            success: true, message: "Login successful", token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        return handleError(error, res);
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return handleError(error, res);
    }
};