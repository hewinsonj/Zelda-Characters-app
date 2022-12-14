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
        .populate("comments.author", "username")
        .then(zeldaChar => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            //this is fine for initial testing
            //res.send(fruits)
            //this is the preferred method for API's
            res.render('zeldaChar/index', { zeldaChar, username, loggedIn, userId})
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})

// GET for new fruit
// renders the form to create a fruit
router.get('/new', (req, res) => {
    const username = req.session.username
    const loggedIn = req.session.loggedIn
    const userId = req.session.userId

    res.render('zeldaChar/new', { username, loggedIn, userId })
})


// POST request
// create route -> gives the ability to create new fruits
router.post("/", (req, res) => {
    // bc our checkboxes dont send true or false(which they totally should but whatev)
    // we need to do some js magic to change the value
    // first side of the equals sign says "set this key to be the value"
    // the value comes from the ternary operator, checking the req.body field
    req.body.allyToLink = req.body.allyToLink === 'on' ? true : false
    // here, we'll get something called a request body
    // inside this function, that will be referred to as req.body
    // this is going to add ownership, via a foreign key reference, to our fruits
    // basically, all we have to do, is append our request body, with the `owner` field, and set the value to the logged in user's id
    req.body.owner = req.session.userId
    console.log('the zeldaChar from the form', req.body)
    // we'll use the mongoose model method `create` to make a new fruit
    ZeldaChar.create(req.body)
        .then(zeldaChar => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            // send the user a '201 created' response, along with the new fruit
            // res.status(201).json({ fruit: fruit.toObject() })
            res.redirect('/zeldaChar')
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})

// GET request
// only fruits owned by logged in user
// we're going to build another route, that is owner specific, to list all the fruits owned by a certain(logged in) user
router.get('/mine', (req, res) => {
    // find the fruits, by ownership
    ZeldaChar.find({ owner: req.session.userId })
    // then display the fruits
        .then(zeldaChar => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            // res.status(200).json({ zeldaChar: zeldaChar })
            res.render('zeldaChar/index', { zeldaChar, username, loggedIn, userId })
        })
    // or throw an error if there is one
        .catch(err => res.redirect(`/error?error=${err}`))
})


// GET request to show the update page
router.get("/edit/:id", (req, res) => {
    const username = req.session.username
    const loggedIn = req.session.loggedIn
    const userId = req.session.userId

    const zeldaCharId = req.params.id

    ZeldaChar.findById(zeldaCharId)
        // render the edit form if there is a fruit
        .then(zeldaChar => {
            res.render('zeldaChar/edit', { zeldaChar, username, loggedIn, userId })
        })
        // redirect if there isn't
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
    // res.send('edit page')
})


// PUT request
// update route -> updates a specific fruit
router.put("/:id", (req, res) => {
    console.log("req.body initially", req.body)
    const id = req.params.id

    req.body.allyToLink = req.body.allyToLink === 'on' ? true : false
    console.log('req.body after changing checkbox value', req.body)
    ZeldaChar.findById(id)
        .then(zeldaChar => {
            if (zeldaChar.owner == req.session.userId) {
                // must return the results of this query
                return zeldaChar.updateOne(req.body)
            } else {
                res.sendStatus(401)
            }
        })
        .then(() => {
            // console.log('returned from update promise', data)
            res.redirect(`/zeldaChar/${id}`)
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})

router.delete('/:id', (req, res) => {
    // get the fruit id
    const zeldaCharId = req.params.id

    // delete and REDIRECT
    ZeldaChar.findByIdAndRemove(zeldaCharId)
        .then(zeldaChar => {
            // if the delete is successful, send the user back to the index page
            res.redirect('/zeldaChar')
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
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
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            res.render('zeldaChar/show', { zeldaChar, username, loggedIn, userId })
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})

// // DELETE request
// // destroy route -> finds and deletes a single resource(fruit)
// router.delete("/:id", (req, res) => {
//     // grab the id from the request
//     const id = req.params.id
//     // find and delete the fruit
//     // Fruit.findByIdAndRemove(id)
//     ZeldaChar.findById(id)
//         .then(zeldaChar => {
//             // we check for ownership against the logged in user's id
//             if (zeldaChar.owner == req.session.userId) {
//                 // if successful, send a status and delete the fruit
//                 res.sendStatus(204)
//                 return zeldaChar.deleteOne()
//             } else {
//                 // if they are not the user, send the unauthorized status
//                 res.sendStatus(401)
//             }
//         })
//         // send the error if not
//         .catch(err => res.json(err))
// })


//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router