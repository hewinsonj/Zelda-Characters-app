/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
const express = require("express") // import express
const ZeldaChar = require('../models/zeldaChar')

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////
// ROUTES
/////////////////////////////////////////////

// GET request
///index route
router.get("/", (req, res) => {
    ZeldaChar.find({})
        .then(zeldaChar => {
            //this is fine for initial testing
            //res.send(fruits)
            //this is the preferred method for API's
            res.json({zeldaChar: zeldaChar})
        })
        .catch(err => console.log(err))
})
/////////// Post REquest
router.post("/", (req, res) => {
    //here we get a request body (req.body)
    ZeldaChar.create(req.body)
        .then(zeldaChar => {
            res.status(201).json({ zeldaChar: zeldaChar.toObject() })
        })
        .catch(error => console.log(error))

})

//////PUT Request

router.put("/:id", (req, res) => {
    //  console.log("I hit the update route", req.params)
      const id = req.params.id
     // res.send("nothing yet but we gettin there")
     //using findbyidandupdate need three arguments
     ZeldaChar.findByIdAndUpdate(id, req.body, { new: true})
      .then(zeldaChar => {
          console.log('the zeldaChar from update', zeldaChar)
          //update sucess is called 204 no content
          res.sendStatus(204)
      })
      .catch(err => console.log())
  })

  //// SHOW request

router.get("/:id", (req, res) => {
    
    const id = req.params.id
    ZeldaChar.findById(id)
        .then(zeldaChar => {
            res.json({ zeldaChar: zeldaChar})
        })
        .catch(err => console.log(err))
})

/////// DELETE Request

router.delete("/:id", (req, res) => {
    //grab id from request
    const id = req.params.id
    //find and delete fruit
    ZeldaChar.findByIdAndRemove(id)
         //send 204 if successfull 
        .then(zeldaChar => {
            res.sendStatus(204)
        })
        //send error if not
        .catch(err => res.json(err))
})


//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router