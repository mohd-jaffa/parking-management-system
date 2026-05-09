const express = require("express")
const morgan = require("morgan")
const configureDB = require("./config/db")
const authController = require("./controllers/auth.controller")
const authenticateUser = require("./middlewares/auth.middleware")
const parkingSlotController = require("./controllers/parkingSlot.controller")
require("dotenv").config()
const port = process.env.PORT
const app = express()
app.use(express.json())
app.use(morgan("dev"))

configureDB();

app.get("/", (req, res) => {
    res.send("pms API running!")
})

// AUTH ROUTES 
app.post( "/api/auth/register", authController.register );
app.post( "/api/auth/login", authController.login );
app.get( "/api/auth/profile", authenticateUser, authController.getProfile );

// SLOT ROUTES
app.post( "/api/slots", authenticateUser, parkingSlotController.createParkingSlot );
app.get( "/api/slots", authenticateUser, parkingSlotController.getParkingSlots );

app.listen(port, () => {
    console.log("Server running on port", port)
})