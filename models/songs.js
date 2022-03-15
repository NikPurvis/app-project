// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

// The schema for Songs
const songSchema = new Schema(
	{
		title: { type: String, required: true },
		artist: { type: String, required: true },
        year: { type: String, required: true },
        genre: { type: String, required: true },
		position: [String]
	},
	{ timestamps: true }
)

const Song = model("Song", songSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Song
