/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const mongoose = require("mongoose") // import mongoose


/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
// this is where we set up our inputs for our database connect function
const DATABASE_URL = process.env.DATABASE_URL

// here is our DB congfig object

const CONFIG = {
    useNewUrlParser : true,
    useUnifiedTopology: true,
}

// establish our connection

mongoose.connect(DATABASE_URL, CONFIG)

// tell mongoose what to do with certain events
// opens, disconnects, errors

mongoose.connection
    .on("open", () => console.log("Connected to Mongoose"))
    .on("close", () => console.log("Disconnected from Mongoose"))
    .on("error", (error) => console.log("An error occured: /n", error))

    /////////////////////////////////////////////
// Export Our Dependencies
/////////////////////////////////////////////

module.exports = mongoose