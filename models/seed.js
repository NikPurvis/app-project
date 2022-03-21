///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require('./connection')
const Songs = require('./songs')


////////////////////////////////////////////
// Seed Code
////////////////////////////////////////////
// save the connection in a variable
const db = mongoose.connection;

db.on('open', () => {
	// Array of starter songs
	const seedSongs = [
        {
            title: "Life on Mars?",
            artist: "David Bowie",
            year: "1971",
            genre: "Glam",
            position: [ "Vocals", "Harmonies", "Guitar", "Bass", "Drums", "Keys" ]
        }, {
            title: "Pour Some Sugar On Me",
            artist: "Def Leppard",
            year: "1987",
            genre: "Rock",
            position: [ "Vocals", "Harmonies", "Guitar", "Bass", "Drums", "Keys" ]
        }, {
            title: "Vacation",
            artist: "The Go-Go's",
            year: "1982",
            genre: "New Wave",
            position: [ "Vocals", "Harmonies", "Guitar", "Bass", "Drums", "Keys" ]
        }, {
            title: "Poker Face",
            artist: "Lady Gaga",
            year: "2008",
            genre: "Pop-Rock",
            position: [ "Vocals", "Harmonies", "Guitar", "Bass", "Drums" ]
        }, {
            title: "Smells Like Teen Spirit",
            artist: "Nirvana",
            year: "1991",
            genre: "Grunge",
            position: [ "Vocals", "Guitar", "Bass", "Drums" ]
        }, {
            title: "It's A Sin",
            artist: "Pet Shop Boys",
            year: "1987",
            genre: "New Wave",
            position: [ "Vocals", "Harmonies", "Guitar", "Bass", "Drums", "Keys" ]
        }, {
            title: "Go With The Flow",
            artist: "Queens of the Stone Age",
            year: "2002",
            genre: "Rock",
            position: [ "Vocals", "Guitar", "Bass", "Drums" ]
        }, {
            title: "Empire",
            artist: "Queensrÿche",
            year: "1990",
            genre: "Metal",
            position: [ "Vocals", "Harmonies", "Guitar", "Bass", "Drums" ]
        }, {
            title: "Superman",
            artist: "R.E.M.",
            year: "1986",
            genre: "Alternative",
            position: [ "Vocals", "Guitar", "Bass", "Drums" ]
        }, {
            title: "New Year's Day",
            artist: "Taylor Swift",
            year: "2017",
            genre: "Pop-Rock",
            position: [ "Vocals", "Harmonies", "Guitar", "Keys" ]
        }, {
            title: "Dancing Queen",
            artist: "ABBA",
            year: "1976",
            genre: "Pop-Rock",
            position: [ "Vocals", "Harmonies", "Bass", "Drums", "Keys" ]
        }, {
            title: "Insane in the Brain",
            artist: "Cypress Hill",
            year: "1993",
            genre: "Hip-Hop",
            position: [ "Vocals", "Bass", "Drums", "Keys" ]
        }, {
            title: "Holiday in Cambodia",
            artist: "Dead Kennedys",
            year: "1987",
            genre: "Punk",
            position: [ "Vocals", "Guitar", "Bass", "Drums", "Keys" ]
        }, {
            title: "Gay Bar",
            artist: "Electric Six",
            year: "2003",
            genre: "Rock",
            position: [ "Vocals", "Guitar", "Bass", "Drums" ]
        }, {
            title: "Much Too Young (To Feel This Damn Old)",
            artist: "Garth Brooks",
            year: "1989",
            genre: "Country",
            position: [ "Vocals", "Harmonies", "Guitar", "Bass", "Drums" ]
        }, {
            title: "Young",
            artist: "Hollywood Undead",
            year: "2008",
            genre: "Nu-Metal",
            position: [ "Vocals", "Guitar", "Bass", "Drums" ]
        }, {
            title: "The Passenger",
            artist: "Iggy Pop",
            year: "1977",
            genre: "Rock",
            position: [ "Vocals", "Guitar", "Bass", "Drums" ]
        }, {
            title: "Code Monkey",
            artist: "Jonathan Coulton",
            year: "2006",
            genre: "Rock",
            position: [ "Vocals", "Guitar", "Bass", "Drums" ]
        }, {
            title: "Need You Now",
            artist: "Lady Antebellum",
            year: "2010",
            genre: "Country",
            position: [ "Vocals", "Duet", "Guitar", "Bass", "Drums", "Keys" ]
        }        
    ]


    // 1. Delete all the data that already exists (will only happen if data exists)
    Songs.remove({})
        .then (deletedSongs => {
            console.log("This is what remove returns:", deletedSongs)
            // 2. Create with our seed data
            Songs.create(seedSongs)
                .then(data => {
                    console.log("Here are the seeded products:", data)
                    db.close()
                })
    })
        .catch(error => {
            console.log(error)
            db.close()
        })
})
