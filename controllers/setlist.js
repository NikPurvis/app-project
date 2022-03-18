////////////////////////////////////////////
// Import dependencies
////////////////////////////////////////////
const express = require("express")
const Songs = require("../models/songs")
const Setlist = require("../models/setlist")
const User = require("../models/user")


////////////////////////////////////////////
// Create router
////////////////////////////////////////////
const router = express.Router()


////////////////////////////////////////////
// Routes
////////////////////////////////////////////

// // Testing to see if I can get .populate() to correctly pull the info I want from Users via Setlist.
// Setlist.find({}).populate("owner", "username")
//     .then((setlist) => {
//         console.log("query results:", setlist )
//         // console.log("So setlist username?", setlist.owner.username)
//     })


// // Testing populate pt2: Want to pull the song info and the user info both by way of Setlist
// Setlist.findOne({})
//     .populate({ path: "request", select: ["title", "artist"]})
//     .populate({ path: "owner", select: "username"})
//     .then((setlist) => {
//         console.log("full entry:", setlist)
//         console.log("query results:", setlist.request.title, setlist.request.artist, setlist.owner.username )
//         // console.log("So setlist username?", setlist.owner.username)
//     })


// INDEX route for setlist, including information from User and Songs documents
router.get("/", (req, res) => {
    Setlist.find({})
        .populate({
            path: "request",
            select: ["title", "artist"]
        })
        .populate({
            path: "owner",
            select: "username"
        })
        .then((setlist) => {
        const username = req.session.username
        const loggedIn = req.session.loggedIn
        res.render("setlist/index", {setlist: setlist, username, loggedIn})
    })
    .catch(error => res.redirect(`/error?error=${error}`))
})


// JSON route to get direct look at all the objects in Setlist
router.get("/json", (req, res) => {
    Setlist.find({})
    .then (setlist => {
        res.send({ setlist })
    })
    .catch(error => res.json(error))
})


// POST route, where the setlist selection info is sent from the add form.
router.post("/create", (req, res) => {
    req.body.ready = req.body.ready === "on" ? true : false
	req.body.owner = req.session.userId
	Setlist.create(req.body)
		.then(setlist => {
			console.log("Create returned:", setlist)
			res.redirect("/setlist")
		})
		.catch(error => res.redirect(`/error?error=${error}`))
})


// DELETE route, to remove songs from the setlist
router.delete("/:id", (req, res) => {
    const setlistId = req.params.id
    Setlist.findByIdAndRemove(setlistId)
        .then((setlist) => {
            console.log("Response from delete:", setlist)
            res.redirect("/setlist")
        })
        .catch(error => res.redirect(`/error?error=${error}`))
})


// ADD route, to view for adding to setlist
router.get("/:id/add", (req, res) => {
    // res.send(":id/add route")
    const songId = req.params.id
    Songs.findById(songId)
    .then(song => {
        const username = req.session.username
        const loggedIn = req.session.loggedIn
        res.render("setlist/add", {song: song, username, loggedIn})
    })
    .catch(error => res.redirect(`/error?error=${error}`))
})


// EDIT route, takes user to the setlist EDIT view
router.get("/:id/edit", (req, res) => {
    const setlistId = req.params.id
    Setlist.findById(setlistId)
    .then(setlist => {
        res.render("setlist/edit", {setlist: setlist })
    })
    .catch(error => res.redirect(`/error?error=${error}`))
})


////////////////////////////////////////////
// Export router
////////////////////////////////////////////
module.exports = router
