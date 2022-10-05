/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
const express = require("express") // import express
const ZeldaChar = require("../models/zeldaChar")

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
    req.body.owner = req.session.userId
    ZeldaChar.create(req.body)
        .then(zeldaChar => {
            res.status(201).json({ zeldaChar: zeldaChar.toObject() })
        })
        .catch(error => console.log(error))

})

// GET request
// only fruits owned by logged in user
// we're going to build another route, that is owner specific, to list all the fruits owned by a certain(logged in) user
router.get('/mine', (req, res) => {
    // find the fruits, by ownership
    ZeldaChar.find({ owner: req.session.userId })
    // then display the fruits
        .then(zeldaChar => {
            res.status(200).json({ zeldaChar: zeldaChar })
        })
    // or throw an error if there is one
        .catch(error => res.json(error))
})

//////PUT Request

// PUT request
// update route -> updates a specific fruit
router.put("/:id", (req, res) => {
    // console.log("I hit the update route", req.params.id)
    const id = req.params.id
    ZeldaChar.findById(id)
        .then(zeldaChar => {
            if (zeldaChar.owner == req.session.userId) {
                res.sendStatus(204)
                return zeldaChar.updateOne(req.body)
            } else {
                res.sendStatus(401)
            }
        })
        .catch(error => res.json(error))
})



  //// SHOW request

// SHOW request
// read route -> finds and displays a single resource
router.get("/:id", (req, res) => {
    const id = req.params.id

    ZeldaChar.findById(id)
        // populate will provide more data about the document that is in the specified collection
        // the first arg is the field to populate
        // the second can specify which parts to keep or which to remove
        // .populate("owner", "username")
        // we can also populate fields of our subdocuments
        .populate("comments.author", "username")
        .then(zeldaChar => {
            res.json({ zeldaChar: zeldaChar })
        })
        .catch(err => console.log(err))
})

// DELETE request
// destroy route -> finds and deletes a single resource(fruit)
router.delete("/:id", (req, res) => {
    // grab the id from the request
    const id = req.params.id
    // find and delete the fruit
    // Fruit.findByIdAndRemove(id)
    ZeldaChar.findById(id)
        .then(zeldaChar => {
            // we check for ownership against the logged in user's id
            if (zeldaChar.owner == req.session.userId) {
                // if successful, send a status and delete the fruit
                res.sendStatus(204)
                return zeldaChar.deleteOne()
            } else {
                // if they are not the user, send the unauthorized status
                res.sendStatus(401)
            }
        })
        // send the error if not
        .catch(err => res.json(err))
})


//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router