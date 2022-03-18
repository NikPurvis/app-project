// import dependencies
const mongoose = require("./connection")

// import user model for populate
const User = require("./user")
const Songs = require("./songs")

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

// The schema for songs that are selected by the user
const SetlistSchema = new Schema(
	{
		title: { type: String, required: true },
		artist: { type: String, required: true },
        position: { type: String },
        comment: { type: String, required: true },
        played: { type: Boolean, required: true, default: false },
        owner: { 
			type: Schema.Types.ObjectID,
			ref: "User",
		}
	},
	{ timestamps: true }
)

// Make the Setlist model
const Setlist = model("Setlist", SetlistSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Setlist
