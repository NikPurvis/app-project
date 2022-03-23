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
router.post("/", (req, res) => {
    Songs.create(req.body)
		.then(songs => {
        console.log("Create returned:", songs)
        res.redirect("/songs")
    })
		.catch(error => res.redirect(`/error?error=${error}`))
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


// router.get("/:id", (req, res) => {
//         const { username, loggedIn } = req.session
//         const songId = req.params.id
//         const response = await fetch(`${URL}/searchtrack.php?s=${song.artist}&t=${song.title}`, {
//             "method": "GET",
//             "headers": {
//                 "x-rapidapi-host": `${FETCH_HEAD_HOST}`,
//                 "x-rapidapi-key": `${APIKEY}`
//             }
//         })
//         if (response.status >= 200 && response.status <= 299) {
//             const jsonResponse = await response.json()
//             console.log("jsonResponse:", jsonResponse)
//         } else {
//             // handle errors
//             console.log("error:", response.stastus, response.statusText)
//         }
//     })


// SHOW route for individual songs, including API data with additional info
router.get("/:id", (req, res) => {
    const { username, loggedIn } = req.session
    const songId = req.params.id
    // Pulls the unique song ID from the database for the URL
    Songs.findById(songId)
        .then(song => {
            // The songDetails variable is a final check to see if the song view will be rendered with API info or just from what's in the database.
            let songDetails = false
            // First, a fetch from the API to see if the artist is listed.
            fetch(`${URL}/search.php?s=${song.artist}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": `${FETCH_HEAD_HOST}`,
                    "x-rapidapi-key": `${APIKEY}`}
            })
            // Converting the API results into JSON so we can use it.
            .then(artistAPI => artistAPI.json())
            .then(artistSearch => {
                // If the artist isn't in the API, resolve the promise chain so we don't keep trying to drill further down into what doesn't exist.
                if (artistSearch.artists === null) {
                    songDetails = false
                    Promise.resolve(songDetails)
                } else {
                    // If the artist was found, put the search results into a variable so we can play with it later and then keep on going.
                    const artist = artistSearch.artists[0]
                    // The second fetch looks for information based on the artist and song title.
                    return fetch(`${URL}/searchtrack.php?s=${song.artist}&t=${song.title}`, {
                        "method": "GET",
                        "headers": {
                            "x-rapidapi-host": `${FETCH_HEAD_HOST}`,
                            "x-rapidapi-key": `${APIKEY}`}
                    })
                    .then(trackAPI => trackAPI.json())
                    // Once again, checking to see if we got anything. If the song didn't pull any info, we resolve the promise.
                    .then(trackSearch => {
                        if (trackSearch.track === null) {
                            songDetails = false
                            Promise.resolve(songDetails)
                        } else {
                            // If the API call got us info, pull the title of the album into a variable for the next search.
                            const albumName = trackSearch.track[0].strAlbum
                            return fetch(`${URL}/searchalbum.php?s=${song.artist}&a=${albumName}`, {
                                "method": "GET",
                                "headers": {
                                    "x-rapidapi-host": `${FETCH_HEAD_HOST}`,
                                    "x-rapidapi-key": `${APIKEY}`}
                            })
                            .then(albumAPI => albumAPI.json())
                            .then(albumSearch => {
                                // Final check that our API call got the data we want, and if not, resolve the promise.
                                if (albumSearch.album === null) {
                                    songDetails = false
                                    Promise.resolve(songDetails)
                                } else {
                                    // Lots of data we can use here, so put it into a variable and then it's time to render the song SHOW view with all the data objects.
                                    songDetails = true
                                    const album = albumSearch.album[0]
                                    res.render("songs/show", {
                                        song: song,
                                        artist: artist,
                                        album: album,
                                        username, loggedIn
                                    })
                                }
                            })
                        }
                    })
                }
                // Here's where we go when the promises resolve early. The SHOW page will render with just the basic song information in the database.
                if (songDetails === false) {
                    res.render("songs/show", { song: song, username, loggedIn })
                }
            })
        })
        // And an error catcher if something goes utterly wrong.
        .catch(error => res.redirect(`/error?error=${error}`))
    })


////////////////////////////////////////////
// Export router
////////////////////////////////////////////
module.exports = router
