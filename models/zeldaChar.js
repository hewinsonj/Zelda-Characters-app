////////////////////////////////////////////////
// Our Models
////////////////////////////////////////////////
// pull schema and model from mongoose
const mongoose = require('./connection')
const User = require('./user')
const commentSchema = require('./comment')


const { Schema, model } = mongoose

// make fruits schema
const zeldaCharSchema = new Schema({
    name: String,
    gameDebut: String,
    allyToLink: Boolean,
    owner: {
       // here we can refer to an objectId
       // by declaring that as the type
       type: Schema.Types.ObjectId,
       // this line, tells us to refer to the User model
      ref: 'User'
    },
    comments: [commentSchema]
}, {timestamps: true })

// make zeldaChar model
const ZeldaChar = model("ZeldaChar", zeldaCharSchema)

///////////////////////////////////////////////////
// Export Model
///////////////////////////////////////////////////
module.exports = ZeldaChar
