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
		request: {
			type: Schema.Types.ObjectID,  // Links to the songs collection
			ref: "songs"
		},
        position: [String],
        comment: { type: String },
        played: { type: Boolean, required: true, default: false },
        owner: { 
			type: Schema.Types.ObjectID,  // Links to the user collection
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
