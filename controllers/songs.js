////////////////////////////////////////////
// Import dependencies
////////////////////////////////////////////
const express = require("express")
const Songs = require("../models/songs")
const Setlist = require("../models/setlist")
const fetch = require("node-fetch")
const { append } = require("express/lib/response")
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
    const { username, loggedIn } = req.session
    // Default sorting  by song title
    Songs.find({}).sort({ title: 1 })
    .then(songs => {
        res.render("songs/index", {songs: songs, username, loggedIn})
    })
    .catch(error => res.redirect(`/error?error=${error}`))
})


// GET route to directly see all the objects in Songs in JSON format
router.get("/json", (req, res) => {
    Songs.find({})
    .then (songs => {
        res.send({ songs })
    })
    .catch(error => res.json(error))
})


// INDEX route, sorting all songs alphabetically by TITLE
router.post("/title", (req, res) => {
    const { username, loggedIn } = req.session
    Songs.find({}).sort({ title: 1 })
        .then(songs => {
            res.render("songs/title", {songs: songs,username, loggedIn})
        })
        .catch(error => res.redirect(`/error?error=${error}`))
})


// INDEX route, sorting all songs alphabetically by ARTIST
router.post("/artist", (req, res) => {
    const { username, loggedIn } = req.session
    Songs.find({}).sort({ artist: 1 })
        .then(songs => {
            res.render("songs/artist", {songs: songs,username, loggedIn})
        })
        .catch(error => res.redirect(`/error?error=${error}`))
})


// INDEX route, sorting all songs numerically by YEAR
router.post("/year", (req, res) => {
    const { username, loggedIn } = req.session
    Songs.find({}).sort({ year: 1 })
        .then(songs => {
            res.render("songs/year", {songs: songs, username, loggedIn})
        })
        .catch(error => res.redirect(`/error?error=${error}`))
})


// INDEX route, sorted alphabetically by GENRE
router.post("/genre", (req, res) => {
    const { username, loggedIn } = req.session
    Songs.find({}).sort({ genre: 1 })
        .then(songs => {
            res.render("songs/genre", {songs: songs, username, loggedIn})
        })
        .catch(error => res.redirect(`/error?error=${error}`))
})


// CREATE route, where new song info is sent from the add form via the NEW route.
router.get("/create", (req, res) => {
    req.body.ready = req.body.ready === "on" ? true : false
    console.log("request body:", req.body)
    res.send(req.body)
})


// DELETE route, to remove songs from the database.


// NEW route, goes to the form for adding to the song library.
router.get("/new", (req, res) => {
    const { username, loggedIn } = req.session
    res.render("songs/new", { username, loggedIn })
})


// EDIT route, to the form for editing a song in the library.
router.get("/:id/edit", (req, res) => {
    res.send("songs /id /edit route")
})


// UPDATE route, sends a PUT request for the changes made in the EDIT view.



// SHOW route for individual songs, including API data with additional info
router.get("/:id", (req, res) => {
    const { username, loggedIn } = req.session
    const songId = req.params.id
    // Pulls the unique song ID from the database for the URL
    Songs.findById(songId)
    .then(song => {
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
                // We only want the album from this query so saving that to a variable we can use for another fetch and to pass to the view
                const albumName = data1.track[0].strAlbum
                return fetch(`${URL}/searchalbum.php?s=${song.artist}&a=${albumName}`, {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-host": `${FETCH_HEAD_HOST}`,
                        "x-rapidapi-key": `${APIKEY}`
                    }
                })
                    // Convert to JSON
                    .then(responseAPI => responseAPI.json())
                    .then(data2 => {
                        // There's a lot of interesting album info, so putting all of it into a variable to more easily access what we want in the view.
                        const album = data2.album[0]

                // Now a third and final new fetch from the API for artist information
                return fetch(`${URL}/search.php?s=${song.artist}`, {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-host": `${FETCH_HEAD_HOST}`,
                        "x-rapidapi-key": `${APIKEY}`
                    }
                })
                    // Convert to JSON
                    .then(responseAPI => responseAPI.json())
                    .then(data3 => {
                        // And once again tossing the fetch info into an object variable for access.
                        const artist = data3.artists[0]
                        // Finally, render the view and pass it the information we've gathered from the fetch calls.
                        res.render("songs/show", {
                        song: song,
                        album: album,
                        artist: artist,
                        albumName,
                        username,
                        loggedIn
                    })
                })
            })
        })
    })
        .catch(error => res.redirect(`/error?error=${error}`))
})


////////////////////////////////////////////
// Export router
////////////////////////////////////////////
module.exports = router
