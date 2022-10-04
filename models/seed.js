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
        { name: "Zelda", gameDebut: "The Legend of Zelda", allyToLink: true },
        { name: "Impa", gameDebut: "The Legend of Zelda", allyToLink: true },
        { name: "Ganon", gameDebut: "The Legend of Zelda", allyToLink: false },
        { name: "Saria", gameDebut: "Ocarina of Time", allyToLink: true },
        { name: "Skull Kid", gameDebut: "Majora's Mask", allyToLink: false }
      ]
      // Delete every fruit in DB
      ZeldaChar.deleteMany({})
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