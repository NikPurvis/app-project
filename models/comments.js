/////////////////////////////////
// import dependencies
/////////////////////////////////d
const mongoose = require('./connection')

// here's an alternate syntax for creating a schema
// reminder: we do not need a model for a subdocument
// all we need is a schema 
const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

module.exports = commentSchema
