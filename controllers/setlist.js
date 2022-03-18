////////////////////////////////////////////
// Import dependencies
////////////////////////////////////////////
const express = require("express")
const Songs = require("../models/songs")
const Setlist = require("../models/setlist")


////////////////////////////////////////////
// Create router
////////////////////////////////////////////
const router = express.Router()


////////////////////////////////////////////
// Routes
////////////////////////////////////////////

// INDEX route for setlist, showing song requests
router.get("/", (req, res) => {
    Setlist.find({})
    .then(setlist => {
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


////////////////////////////////////////////
// Export router
////////////////////////////////////////////
module.exports = router
