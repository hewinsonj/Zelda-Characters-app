////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const ZeldaChar = require("../models/zeldaChar")

/////////////////////////////////////////
// Create Router
/////////////////////////////////////////
const router = express.Router()


/////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// POST
// only loggedIn users can post comments
router.post("/:zeldaCharId", (req, res) => {
    const zeldaCharId = req.params.zeldaCharId

    if (req.session.loggedIn) {
        // we want to adjust req.body so that the author is automatically assigned
        req.body.author = req.session.userId
    } else {
        res.sendStatus(401)
    }
    // find a specific fruit
    ZeldaChar.findById(zeldaCharId)
        // do something if it works
        //  --> send a success response status and maybe the comment? maybe the fruit?
        .then(zeldaChar => {
            // push the comment into the fruit.comments array
            zeldaChar.comments.push(req.body)
            // we need to save the fruit
            return zeldaChar.save()
        })
        .then(zeldaChar => {
            res.redirect(`/zeldaChar/${zeldaChar.id}`)
        })
        // do something else if it doesn't work
        //  --> send some kind of error depending on what went wrong
        .catch(err => res.redirect(`/error?error=${err}`))
})


// DELETE
// only the author of the comment can delete it
router.delete('/delete/:zeldaCharId/:commId', (req, res) => {
    // isolate the ids and save to vars for easy ref
    const zeldaCharId = req.params.zeldaCharId 
    const commId = req.params.commId
    // get the fruit
    ZeldaChar.findById(zeldaCharId)
        .then(zeldaChar => {
            // get the comment
            // subdocs have a built in method that you can use to access specific subdocuments when you need to.
            // this built in method is called .id()
            const theComment = zeldaChar.comments.id(commId)
            console.log('this is the comment that was found', theComment)
            // make sure the user is logged in
            if (req.session.loggedIn) {
                // only let the author of the comment delete it
                if (theComment.author == req.session.userId) {
                    // find some way to remove the comment
                    // here's another built in method
                    theComment.remove()
                    zeldaChar.save()
                    res.redirect(`/zeldaChar/${zeldaChar.id}`)
                    // return the saved fruit
                    //return zeldaChar.save()
                } else {
                    const err = 'you%20are%20not%20authorized%20for%20this%20action'
                    res.redirect(`/error?error=${err}`)
                }
            } else {
                const err = 'you%20are%20not%20authorized%20for%20this%20action'
                res.redirect(`/error?error=${err}`)
            }
        })
        // send an error if error
        .catch(err => res.redirect(`/error?error=${err}`))

})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router