const mongoose = require("mongoose");

async function configureDB() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("connected to db");
    } catch (err) {
        console.log("error connecting to db");
        process.exit(1);
    }
}

module.exports = configureDB;