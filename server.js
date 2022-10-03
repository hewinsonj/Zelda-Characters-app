/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const express = require("express") // import express
const morgan = require("morgan") // import morgan
const mongoose = require("mongoose") // import mongoose
const path = require("path") // import path module

////////////////////////////////////////////
////////////// Import our models
////////////////////////////////////
const ZeldaChar = require('./models/zeldaChar')
const { error } = require("console")

/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
// Setup inputs for our connect function
const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

// Establish Connection
mongoose.connect(DATABASE_URL, CONFIG)

// Events for when connection opens/disconnects/errors
mongoose.connection
  .on("open", () => console.log("Connected to Mongoose"))
  .on("close", () => console.log("Disconnected from Mongoose"))
  .on("error", (error) => console.log("An error occured : /n", error))


/////////////////////////////////////////////////
// Create our Express Application Object Bind Liquid Templating Engine
/////////////////////////////////////////////////
const app = express()

/////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////
app.use(morgan("tiny")) //logging
app.use(express.urlencoded({ extended: true })) // parse urlencoded request bodies
app.use(express.static("public")) // serve files from public statically
app.use(express.json()) // parses incoming requests with JSON payloads

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("your server is running... better catch it.")
  })
  
  app.get("/zeldaChar/seed", (req, res) => {
    const startChars = [
        { name: "Zelda", gameDebut: "The Legend of Zelda", allyToLink: true },
        { name: "Impa", gameDebut: "The Legend of Zelda", allyToLink: true },
        { name: "Ganon", gameDebut: "The Legend of Zelda", allyToLink: false },
        { name: "Saria", gameDebut: "Ocarina of Time", allyToLink: true },
        { name: "Skull Kid", gameDebut: "Majora's Mask", allyToLink: false }
      ]
      // Delete every fruit in DB
      ZeldaChar.deleteMany({})
        .then(() => {
            // seed with starter fruits array
            ZeldaChar.create(startChars)
                .then(data => {
                    res.json(data)
                })
        })
})

////////INDEX ROUTE
app.get("/zeldaChar", (req, res) => {
    ZeldaChar.find({})
        .then(zeldaChar => {
            //this is fine for initial testing
            //res.send(fruits)
            //this is the preferred method for API's
            res.json({zeldaChar: zeldaChar})
        })
        .catch(err => console.log(err))
})
/////////POST ROUTE

app.post("/zeldaChar", (req, res) => {
    //here we get a request body (req.body)
    ZeldaChar.create(req.body)
        .then(zeldaChar => {
            res.status(201).json({ zeldaChar: zeldaChar.toObject() })
        })
        .catch(error => console.log(error))

})

///////////UPDATE ROUTE

app.put("/zeldaChar/:id", (req, res) => {
    //  console.log("I hit the update route", req.params)
      const id = req.params.id
     // res.send("nothing yet but we gettin there")
     //using findbyidandupdate need three arguments
     ZeldaChar.findByIdAndUpdate(id, req.body, { new: true})
      .then(zeldaChar => {
          console.log('the character from update', zeldaChar)
          //update sucess is called 204 no content
          res.sendStatus(204)
      })
      .catch(err => console.log())
  })

  ////////  SHOW ROUTE

  app.get("/zeldaChar/:id", (req, res) => {
    
    const id = req.params.id
    ZeldaChar.findById(id)
        .then(zeldaChar => {
            res.json({ zeldaChar: zeldaChar})
        })
        .catch(err => console.log(err))
})

//////// DELETE ROUTE

app.delete("/zeldaChar/:id", (req, res) => {
    //grab id from request
    const id = req.params.id
    ZeldaChar.findByIdAndRemove(id)
        .then(zeldaChar => {
            res.sendStatus(204)
        })
        .catch(err => res.json(err))
})

  //////////////////////////////////////////////
// Server Listener
//////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now Listening to The Great Deku Tree on port ${PORT}`))

//END