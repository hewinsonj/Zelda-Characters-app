/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const express = require("express") // import express
const path = require("path") // import path module


const ZeldaCharRouter = require('./controllers/zeldaControllers')
const UserRouter = require('./controllers/userControllers')
const CommentRouter = require('./controllers/commentControllers')
const middleware = require('./utils/middleware')

/////////////////////////////////////////////////
// Create our Express Application Object Bind Liquid Templating Engine
/////////////////////////////////////////////////
// const app = express()
const app = require('liquid-express-views')(express())
/////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////
// app.use(morgan("tiny")) //logging
// app.use(express.urlencoded({ extended: true })) // parse urlencoded request bodies
// app.use(express.static("public")) // serve files from public statically
// app.use(express.json()) // parses incoming requests with JSON payloads

middleware(app)

////////////////////////////////////////////
// Home Route
////////////////////////////////////////////
app.get("/", (req, res) => {
  // res.send("Your server is running, better go out and catch it")
  // you can also send html as a string from res.send
  // res.send("<small style='color: red'>Your server is running, better go out and catch it</small>")
  if (req.session.loggedIn) {
      res.redirect('/zeldaChar')
  } else {
      res.render('index.liquid')
  }
})
  
/////////////////////////////////////////////
// Register our Routes
/////////////////////////////////////////////
// here is where we register our routes, this is how server.js knows to send the appropriate request to the appropriate route and send the correct response
// app.use, when we register a route, needs two arguments
// the first, is the base url endpoint, the second is the file to use
app.use('/zeldaChar', ZeldaCharRouter)
app.use('/comments', CommentRouter)
app.use('/users', UserRouter)

// this renders an error page, gets the error from a url request query
app.get('/error', (req, res) => {
  // get session variables
  const { username, loggedIn, userId } = req.session
  const error = req.query.error || 'This page does not exist'

  res.render('error.liquid', { error, username, loggedIn, userId })
})

// this is a catchall route, that will redirect to the error page for anything that doesn't satisfy a controller
app.all('*', (req, res) => {
  res.redirect('/error')
})

  //////////////////////////////////////////////
// Server Listener
//////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now Listening to The Great Deku Tree on port ${PORT}`))

//END