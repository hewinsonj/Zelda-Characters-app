///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require('./connection')
const ZeldaChar = require('./zeldaChar')


///////////////////////////////////////
// Seed Script code
///////////////////////////////////////
// first we need our connection saved to a variable for easy reference
const db = mongoose.connection

db.on('open', () => {
    const startChars = [
        { name: "Tallon", gameDebut: "Ocarina of Time", allyToLink: true },
        { name: "Tingle", gameDebut: "Majora's Mask", allyToLink: true },
        { name: "Great Fairy", gameDebut: "The Legend of Zelda", allyToLink: true },
        { name: "The Phonogram Man", gameDebut: "Ocarina of Time", allyToLink: true },
        { name: "Tatl", gameDebut: "Majora's Mask", allyToLink: true }
      ]
      // Delete every fruit in DB
      ZeldaChar.deleteMany({owner: null})
      .then(deletedChars => {
        console.log('this is what .deleteMany returns', deletedChars)

        // create a bunch of new fruits from startFruits
        ZeldaChar.create(startChars)
            .then(data => {
                console.log('here are the newly created chars', data)
                // always close connection to the db
                db.close()
            })
            .catch(error => {
                console.log(error)
                // always close connection to the db
                db.close()
            })
    })
    .catch(error => {
        console.log(error)
        // always close connection to the db
        db.close()
    })
})