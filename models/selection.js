// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

// The schema for songs that are selected by the user
const selectSchema = new Schema(
	{
		title: { type: String, required: true },
		artist: { type: String, required: true },
        position: { type: String },
        user_id: { type: String },
        comment: { type: String, required: true },
        played: { type: Boolean, required: true, default: false }
	},
	{ timestamps: true }
)

// Make the Selection model
const selection = model("selection", selectSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = selection
