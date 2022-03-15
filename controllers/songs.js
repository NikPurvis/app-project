////////////////////////////////////////////
// Import dependencies
////////////////////////////////////////////
const express = require("express")


////////////////////////////////////////////
// Create router
////////////////////////////////////////////
const router = express.Router()


////////////////////////////////////////////
// Routes
////////////////////////////////////////////

// SONGS route
router.get("/", (req, res) => {
    res.send("/songs route")
    // res.render("index")
})

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
