////////////////////////////////////////////
// Import dependencies
////////////////////////////////////////////
const express = require("express")
const Songs = require("../models/songs")
const Setlist = require("../models/setlist")
const res = require("express/lib/response")


////////////////////////////////////////////
// Create router
////////////////////////////////////////////
const router = express.Router()


////////////////////////////////////////////
// Routes
////////////////////////////////////////////

// INDEX route for setlist, including information from User and Songs documents
router.get("/", (req, res) => {
    const { username, userId, loggedIn } = req.session
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
        res.render("setlist/index", {setlist: setlist, username, userId, loggedIn})
    })
    .catch(error => res.redirect(`/error?error=${error}`))
})


// GET route for showing all the items in Setlist in JSON format
router.get("/json", (req, res) => {
    Setlist.find({})
    .then (setlist => {
        res.send({ setlist })
    })
    .catch(error => res.json(error))
})


// INDEX route for showing the user's Setlist requests
router.get("/mine", (req, res) => {
    // Destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Setlist.find({ owner: userId })
    // Pull in song info to populate the Setlist
        .populate({
            path: "request",
            select: ["title", "artist"]
        })
        .populate({
            path: "owner",
            select: "username"
        })
        .then(setlist => {
			res.render("setlist/index", { setlist: setlist, username, userId, loggedIn })
		})
		.catch(error => res.redirect(`/error?error=${error}`))
})


// CREATE route, where the setlist selection info is sent from the add form.
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


// NEW route, to the form for adding to setlist
router.get("/:id/add", (req, res) => {
    const { username, loggedIn } = req.session
    const songId = req.params.id
    Songs.findById(songId)
    .then(song => {
        res.render("setlist/add", {song: song, username, loggedIn})
    })
    .catch(error => res.redirect(`/error?error=${error}`))
})


// EDIT route, takes user to the setlist edit view
router.get("/:id/edit", (req, res) => {
    const { username, loggedIn } = req.session
    const setlistId = req.params.id
    Setlist.findById(setlistId)
        .populate({
            path: "request",
            select: ["title", "artist", "position"]
        })
    .then(setlist => {
        res.render("setlist/edit", {setlist: setlist, username, loggedIn })
    })
    .catch(error => res.redirect(`/error?error=${error}`))
})


// UPDATE route, sends a PUT request for the changes made on the EDIT view
router.put("/:id", (req, res) => {
    const setlistId = req.params.id
    req.body.ready = req.body.ready === 'on' ? true : false
    Setlist.findByIdAndUpdate(setlistId, req.body)
        .then(setlist => {
            res.redirect("/setlist")
        })
        .catch(error => res.redirect(`/error?error=${error}`))
})


////////////////////////////////////////////
// Export router
////////////////////////////////////////////
module.exports = router
