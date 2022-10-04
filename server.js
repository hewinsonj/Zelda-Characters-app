/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const express = require("express") // import express
const path = require("path") // import path module


const ZeldaCharRouter = require('./controllers/zeldaControllers')
const UserRouter = require('./controllers/userControllers')
const middleware = require('./utils/middleware')


////////////////////////////////////////////
////////////// Import our models
////////////////////////////////////
// const ZeldaChar = require('./models/zeldaChar')
// const { error } = require("console")

/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
// Setup inputs for our connect function
// const DATABASE_URL = process.env.DATABASE_URL
// const CONFIG = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }

// Establish Connection
// mongoose.connect(DATABASE_URL, CONFIG)

// // Events for when connection opens/disconnects/errors
// mongoose.connection
//   .on("open", () => console.log("Connected to Mongoose"))
//   .on("close", () => console.log("Disconnected from Mongoose"))
//   .on("error", (error) => console.log("An error occured : /n", error))


/////////////////////////////////////////////////
// Create our Express Application Object Bind Liquid Templating Engine
/////////////////////////////////////////////////
const app = express()

/////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////
// app.use(morgan("tiny")) //logging
// app.use(express.urlencoded({ extended: true })) // parse urlencoded request bodies
// app.use(express.static("public")) // serve files from public statically
// app.use(express.json()) // parses incoming requests with JSON payloads

middleware(app)

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("your server is running... better catch it.")
  })
  
/////////////////////////////////////////////
// Register our Routes
/////////////////////////////////////////////
// here is where we register our routes, this is how server.js knows to send the appropriate request to the appropriate route and send the correct response
// app.use, when we register a route, needs two arguments
// the first, is the base url endpoint, the second is the file to use
app.use('/zeldaChar', ZeldaCharRouter)
app.use('/users', UserRouter)



  //////////////////////////////////////////////
// Server Listener
//////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now Listening to The Great Deku Tree on port ${PORT}`))

//END