////////////////////////////////////////////
// Import dependencies
////////////////////////////////////////////
const express = require("express")
const Songs = require("../models/songs")


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
        res.render("songs/index", {songs: songs})
    })
    .catch(error => res.json(error))
})


// JSON route to get direct look at all the objects in Songs
router.get("/json", (req, res) => {
    Songs.find({})
    .then (songs => {
        res.send({ songs })
    })
    .catch(error => res.json(error))
})

// SHOW route, sorting all songs alphabetically by TITLE
router.post("/title", (req, res) => {
    Songs.find({}).sort({ title: 1 })
        .then(songs => {
            res.render("songs/title", {songs: songs})
        })
        .catch(error => res.json(error))
})

// SHOW route, sorting all songs alphabetically by ARTIST
router.post("/artist", (req, res) => {
    Songs.find({}).sort({ artist: 1 })
        .then(songs => {
            res.render("songs/artist", {songs: songs})
        })
        .catch(error => res.json(error))
})

// SHOW route, sorting all songs alphabetically by YEAR
router.post("/year", (req, res) => {
    Songs.find({}).sort({ year: 1 })
        .then(songs => {
            res.render("songs/year", {songs: songs})
        })
        .catch(error => res.json(error))
})

// SHOW route, sorting all songs alphabetically by GENRE
router.post("/genre", (req, res) => {
    Songs.find({}).sort({ genre: 1 })
        .then(songs => {
            res.render("songs/genre", {songs: songs})
        })
        .catch(error => res.json(error))
})

// SHOW route for individual songs
router.get("/:id", (req, res) => {
    const songId = req.params.id
    Songs.findById(songId)
        .then(song => {
            res.render("songs/show", {song})
        })
        .catch(error => res.json(error))
})



// router.get("/songs", (req, res) => {
//     res.render("/")
// })

// // SHOW route
// router.post("/", (req, res) => {
//     const zip = req.body.zipcode
//     const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&units=imperial&appid=${APIKEY}`
//     fetch(url)
//         .then(responseAPI => {
//             return responseAPI.json()
//         })
//         .then(responseJSON => {
//             let weatherData = responseJSON
//             // console.log("api?", weatherData.name)
//             res.render("weather/show", {
//                 city: weatherData.name,
//                 currTemp: Math.round(weatherData.main.temp),
//                 description: weatherData.weather[0].description,
//                 feelsTemp: Math.round(weatherData.main.feels_like),
//                 minTemp: Math.round(weatherData.main.temp_min),
//                 maxTemp: Math.round(weatherData.main.temp_max),
//                 sunrise: moment.unix(weatherData.sys.sunrise).format("h:mm a"),
//                 sunset: moment.unix(weatherData.sys.sunset).format("h:mm a")
//             })
//         })
// }) 


////////////////////////////////////////////
// Export router
////////////////////////////////////////////
module.exports = router
