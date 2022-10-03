////////////////////////////////////////////////
// Our Models
////////////////////////////////////////////////
// pull schema and model from mongoose
const mongoose = require("mongoose")

const { Schema, model } = mongoose

// make fruits schema
const zeldaCharSchema = new Schema({
  name: String,
  gameDebut: String,
  allyToLink: Boolean,
})

// make zeldaChar model
const ZeldaChar = model("ZeldaChar", zeldaCharSchema)

///////////////////////////////////////////////////
// Export Model
///////////////////////////////////////////////////
module.exports = ZeldaChar
