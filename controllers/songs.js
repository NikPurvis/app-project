////////////////////////////////////////////
// Import dependencies
////////////////////////////////////////////
const express = require("express")
const Songs = require("../models/songs")
const Setlist = require("../models/setlist")
const fetch = require("node-fetch")
const URL = process.env.FETCH_URL
const APIKEY = process.env.APIKEY
const FETCH_HEAD_HOST = process.env.FETCH_HEAD_HOST


////////////////////////////////////////////
// Create router
////////////////////////////////////////////
const router = express.Router()


////////////////////////////////////////////
// Routes
////////////////////////////////////////////

// INDEX route for all songs
router.get("/", (req, res) => {
    // res.send("/songs route")
    Songs.find({})
    .then(songs => {
        const username = req.session.username
		const loggedIn = req.session.loggedIn
        res.render("songs/index", {songs: songs, username, loggedIn})
    })
    .catch(error => res.redirect(`/error?error=${error}`))
})


// JSON route to get direct look at all the objects in Songs
router.get("/json", (req, res) => {
    Songs.find({})
    .then (songs => {
        res.send({ songs })
    })
    .catch(error => res.json(error))
})


// INDEX route, sorting all songs alphabetically by TITLE
router.post("/title", (req, res) => {
    Songs.find({}).sort({ title: 1 })
        .then(songs => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            res.render("songs/title", {songs: songs,username, loggedIn})
        })
        .catch(error => res.redirect(`/error?error=${error}`))
})


// INDEX route, sorting all songs alphabetically by ARTIST
router.post("/artist", (req, res) => {
    Songs.find({}).sort({ artist: 1 })
        .then(songs => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            res.render("songs/artist", {songs: songs,username, loggedIn})
        })
        .catch(error => res.redirect(`/error?error=${error}`))
})


// INDEX route, sorting all songs numerically by YEAR
router.post("/year", (req, res) => {
    Songs.find({}).sort({ year: 1 })
        .then(songs => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            res.render("songs/year", {songs: songs, username, loggedIn})
        })
        .catch(error => res.redirect(`/error?error=${error}`))
})


// INDEX route, sorted alphabetically by GENRE
router.post("/genre", (req, res) => {
    Songs.find({}).sort({ genre: 1 })
        .then(songs => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            res.render("songs/genre", {songs: songs, username, loggedIn})
        })
        .catch(error => res.redirect(`/error?error=${error}`))
})


// // POST route, where the setlist selection info is sent from the add form.
// router.post("/create", (req, res) => {
//     req.body.ready = req.body.ready === "on" ? true : false

// 	req.body.owner = req.session.userId
// 	Setlist.create(req.body)
// 		.then(setlist => {
// 			console.log("Create returned:", setlist)
// 			res.redirect("/songs")
// 		})
// 		.catch(error => res.redirect(`/error?error=${error}`))
// })


// SHOW route for individual songs, including API data with additional info
router.get("/:id", (req, res) => {
    const songId = req.params.id
    // Pulls the unique song ID from the database for the URL
    Songs.findById(songId)
    .then(song => {
        const username = req.session.username
        const loggedIn = req.session.loggedIn
        // Uses the song artist and title to search the API
        fetch(`${URL}/searchtrack.php?s=${song.artist}&t=${song.title}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": `${FETCH_HEAD_HOST}`,
                "x-rapidapi-key": `${APIKEY}`
            }
        })
            // Converts the response to JSON so we can play with it
            .then(responseAPI => responseAPI.json())
            .then(data1 => {
                // We only want the album from this query so saving that to a variable we can pass to the view
                const album = data1.track[0].strAlbum
                // A new fetch from the API for artist information
                return fetch(`${URL}/search.php?s=${song.artist}`, {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-host": `${FETCH_HEAD_HOST}`,
                        "x-rapidapi-key": `${APIKEY}`
                    }
                })
                    // Converting the new fetch to JSON
                    .then(responseAPI => responseAPI.json())
                    .then(data2 => {
                        // Putting the object info to a variable so we can more easily access what we want in the view
                        const artist = data2.artists[0]
                        // Finally, render the view and pass it the information we've gathered from the fetch calls.
                        res.render("songs/show", {
                        song: song,
                        album: album,
                        artist: artist,
                        username,
                        loggedIn
                    })
                })
            })
        })
        .catch(error => res.redirect(`/error?error=${error}`))
})


// // ADD route, to view for adding to setlist
// router.get("/:id/add", (req, res) => {
//     // res.send(":id/add route")
//     const songId = req.params.id
//     Songs.findById(songId)
//     .then(song => {
//         const username = req.session.username
//         const loggedIn = req.session.loggedIn
//         res.render("songs/add", {song: song, username, loggedIn})
//     })
//     .catch(error => res.redirect(`/error?error=${error}`))
// })


// router.get("/songs", (req, res) => {
//     res.render("/")
// })


////////////////////////////////////////////
// Export router
////////////////////////////////////////////
module.exports = router
