const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const configureDB = require("./config/db")
const authController = require("./controllers/auth.controller")
const authenticateUser = require("./middlewares/auth.middleware")
const parkingSlotController = require("./controllers/parkingSlot.controller")
const parkingTicketController = require("./controllers/parkingTicket.controller")
const vehicleController = require("./controllers/vehicle.controller")
require("dotenv").config()
const port = process.env.PORT
const app = express()
app.use(cors())
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
app.delete( "/api/slots/:id", parkingSlotController.deleteParkingSlot );
app.put( "/api/slots/:id", parkingSlotController.restoreParkingSlot );

// TICKET ROUTES
app.get( "/api/tickets", authenticateUser, parkingTicketController.getParkingTickets );
app.post( "/api/tickets", authenticateUser, parkingTicketController.createParkingTicket );
app.put( "/api/tickets/exit/:id", authenticateUser, parkingTicketController.exitVehicle );

// VEHICLE ROUTES
app.get( "/api/vehicles", authenticateUser, vehicleController.getVehicles );
app.get( "/api/vehicles/:id/tickets", authenticateUser, vehicleController.getVehicleTickets );

app.listen(port, () => {
    console.log("Server running on port", port)
})