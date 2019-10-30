require("dotenv").config();



//All of the environment variables
var keys = require('./keys');
var request = require('request');
var Spotify = require('node-spotify-api')
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var fs = require('fs');

//setting the user inputs
var command1 = process.argv[2];
var command2 = process.argv.slice(3).join("+");

// This is the function that runs if you type spotify-this-song. It is called in the switch function below
function spotifyThis() {

    //setting the song title
    var songName = command2

    //This runs if the user doesn't enter any search information in after the first commnand
    if (songName == "") {

        //Searching the spotify API
        spotify.search({ type: 'track', query: "The Sign Ace of Base", limit: 1 }, function (err, data) {

            //Loggin errors if any
            if (err) {
                console.log('Error occurred: ' + err);
            }

            //setting the artist, title, and link for the searchless result
            var artist = data.tracks.items[0].album.artists[0].name
            var title = data.tracks.items[0].name
            var link = data.tracks.items[0].album.external_urls.spotify
            var album = data.tracks.items[0].album.name

            //displaying the information
            console.log("YOU DIDN'T ENTER ANYTHING, DEFAULTING TO THE GREATEST SONG EVER!")
            console.log("Artist: " + artist);
            console.log("Song Title: " + title);
            console.log("Preview Link: " + link);
            console.log("Album: " + album)

            //sending our results to our log.txt file
            fs.appendFile("log.txt", "***********************DATA********************************" + "\nCommand: " + command1 + "\nSearch: " + songName + "\nArtist: " + artist + "\nSong Title: " + title + "\nPreview Link: " + link + "\n ", function (err) {
                if (err) {
                    return console.log(err);
                }
            })
        });
    }

    //This runs if a song title is actually entered, pretty much the same as above 
    else {
        spotify.search({ type: 'track', query: songName, limit: 1 }, function (err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
            }
            var artist = data.tracks.items[0].album.artists[0].name
            var title = data.tracks.items[0].name
            var link = data.tracks.items[0].album.external_urls.spotify
            var album = data.tracks.items[0].album.name
            console.log("Artist: " + artist);
            console.log("Song Title: " + title);
            console.log("Preview Link: " + link);
            console.log("Album: " + album)

            fs.appendFile("log.txt", "***********************DATA********************************" + "\nCommand: " + command1 + "\nSearch: " + songName + "\nArtist: " + artist + "\nSong Title: " + title + "\nPreview Link: " + link + "\n ", function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        });
    }
}

// This is the function that runs if you type concert-this. It is called in the switch function below.
function concertThis() {

    //setting our bandName variable from our search input
    var bandName = command2
   
    //Setting our query URL
    var queryUrl = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp"

    //Searching the bands in town API
    request(queryUrl, function (err, response, data) {
        if (err && response.statusCode != 200) {
            console.log('error:', err);
            console.log('statusCode:', response && response.statusCode);
        }

        //Parsing the data so we can dig into it.
        var bP = JSON.parse(data);
        // console.log("***********************DATA********************************")
        // fs.appendFile("log.txt", "***********************DATA********************************" + "\nCommand: " + command1 + "\nSearch: " + command2 + "\n***********************************************************\n", function (err) {
        //     if (err) {
        //         return console.log(err);
        //     }
        // });
        
        //iterating through the bands in town data and setting the venue name, region, country, and city
        for (i = 0; i < bP.length; i++) {
            var venue = bP[i].venue.name
            var region = bP[i].venue.region
            var country = bP[i].venue.country
            var city = bP[i].venue.city

            //Console logging out data, log.txt append code has been commented out for now because it was not working properly
            console.log("Venue: " + venue)
            // fs.appendFile("log.txt", "\nvenue: " + venue, function (err) {
            //     if (err) {
            //         return console.log(err);
            //     }
            // });
            if (region === "") {
                console.log("Location: " + city + ", " + country)
                // fs.appendFile("log.txt", "\nLocation: " + city + ", " + country, function (err) {
                //     if (err) {
                //         return console.log(err);
                //     }
                // });
            }
            else {
                console.log("Location: " + city + ", " + region)
                // fs.appendFile("log.txt", "\nLocation: " + city + ", " + region, function (err) {
                //     if (err) {
                //         return console.log(err);
                //     }
                // });
            }
            console.log("Date: " + moment(bP[i].datetime).format('L'));
            // fs.appendFile("log.txt", "\nDate: " + moment(bP[i].datetime).format('L') + "\n ", function (err) {
            //     if (err) {
            //         return console.log(err);
            //     }
            // });
            console.log("***********************************************************")
        };
    });
};

// This is the function that runs if you type movie-this. It is called in the switch function below.
function movieThis() {
    //setting our movie variable based on our input
    var movie = command2;

    //setting our queryURL
    var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie + "";

    //This runs if nothing is typed in after the first command. It defaults our movie name to Mr. Nobody
    if (queryUrl === "http://www.omdbapi.com/?apikey=trilogy&t=") {
        queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=Mr.+Nobody";
    }

    //uses the queryUrl to get our movie information from OMDB
    request(queryUrl, function (err, response, data) {

        //logs errors if any
        if (err) {
            console.log('error:', err);
            console.log('statusCode:', response);
        }
        
        //parses our data
        var mP = JSON.parse(data);

        //logs the data
        console.log("***********************DATA********************************")
        console.log("Title: " + mP.Title);
        console.log("Year Released: " + mP.Year);
        console.log("IMDD Rating: " + mP.Ratings[0].Value);
        console.log("Rotten Tomatoes Rating: " + mP.Ratings[1].Value);
        console.log("Countries where the movie was produced: " + mP.Country);
        console.log("Language: " + mP.Language);
        console.log("Plot: " + mP.Plot);
        console.log("Actors: " + mP.Actors);

        //appends the data to our log.txt file
        fs.appendFile("log.txt", "\n***********************DATA********************************" + "\nCommand: " + command1 + "\nSearch: " + movie + "\nTitle: " + mP.Title + "\nYear Released: " + mP.Year + "\nIMDD Rating: " + mP.Ratings[0].Value + "\nRotten Tomatoes Rating: " + mP.Ratings[1].Value + "\nCountries where the movie was produced: " + mP.Country + "\nLanguage: " + mP.Language + "\nPlot: " + mP.Plot + "\nActors: " + mP.Actors + "\n ", function (err) {
            if (err) {
                return console.log(err);
            }
        });

    })
}


//this is the switch that makes the whole thing go, it runs the function that corresponds to the input entered
function run() {
    switch (command1) {
        
        case "spotify-this-song":
            spotifyThis();
            break;

        case "concert-this":
            concertThis();
            break;

        case "movie-this":
            movieThis();
            break;
    }
}

//this portion runs if do-what-it-says is entered
switch (command1) {
    case "do-what-it-says":
        //sends the commands to the log.
        fs.readFile("random.txt", "utf8", function (err, data) {
            if (err) {
                return console.log(err);
            }
            var dataArr = data.split(",");
            command1 = dataArr[0];
            command2 = dataArr[1].replace(/"/g, "");
            run();
        })
        break;
}