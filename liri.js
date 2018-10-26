require("dotenv").config();
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
// fs is a core Node package for reading and writing files
var fs = require("fs");

// Declare variables
var Spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var firstArg = process.argv[2];
var secondArg = process.argv[3];
var numArgs = process.argv.length;
var notProcessingFile = true;
var outputStr = "";

var cmdStr = "";
for (var j = 2; j < process.argv.length; j++) {
    cmdStr = cmdStr + " " + process.argv[j];
}

// Write data to the log.txt file
function writeToFile (outStr) {
    fs.appendFile("log.txt", outStr, function(err) {
        // If an error was experienced we say it.
        if (err) { console.log("Error occurred: " + err); }
      });
    
}

outputStr = "\n############### Your Request was: ###############" + 
            "\n" + cmdStr +
            "\n############# Here are your results #############"
console.log(outputStr);
writeToFile(outputStr);

// Process the request and allow it to be run using 
// a command read in from a file
function processRequest() {
    if (firstArg === "my-tweets") {
        // Process Twitter request
        var params = {screen_name: "DummyRLS",
                    count: 20};
        client.get("statuses/user_timeline", params, function(error, tweets, response) {
            if (!error && response.statusCode === 200) {
                outputStr = "";
                for (var i = 0; i < tweets.length; i++) {
                    outputStr = outputStr + "\n******************************************" +
                    "\nText: " + tweets[i].text + 
                    "\nDate Created: " + tweets[i].created_at;
                }
                outputStr = outputStr + "\n******************************************\n"
                console.log(outputStr);
                writeToFile(outputStr);
            } else {
                return console.log("Error occurred: " + error);
            }
        }); // end client.get for twitter
    } // end if firstArg === "my-tweets"
    else if (firstArg === "spotify-this-song") {
        // Process Spotify request
        // If user did not put movie title within quotes, 
        // concatenate them together and treat it as a single argument
        if (numArgs < 4) { 
            if (notProcessingFile) {
                // No movie was provided - default to M. Nobody
                secondArg = "The Last Train to Clarksville";
            }
        }
        else {
            for (var i = 4; i < numArgs; i++) {
                secondArg = (secondArg + "+" + process.argv[i]);
            } 
        }

        var songName = secondArg;
        Spotify.search({ type: "track", query: songName }, function(err, data) {
            if (err) {
              return console.log("Error occurred: " + err);
            } else {
                outputStr = "\n******************************************" + 
                    "\nArtist(s): " + data.tracks.items[0].album.artists[0].name +  
                    "\nSong Name: " + songName.toUpperCase() + 
                    "\nPreview Link of the song from spotify: " + data.tracks.items[0].preview_url +  
                    "\nThe album that the song is from: " + data.tracks.items[0].album.name + 
                    "\n******************************************\n"; 

                console.log(outputStr);
                writeToFile(outputStr);
            }
        }); // end Spotify.search

    } //end else if firstArg === "spotify-this-song"
    else if (firstArg === "movie-this") {
        // Process OMDB request
        // If user did not put movie title within quotes, 
        // concatenate them together and treat it as a single argument
        if (numArgs < 4) { 
            // No movie was provided - default to M. Nobody
            secondArg = "Mr.+Nobody";
        }
        else {
            for (var i = 4; i < numArgs; i++) {
                secondArg = (secondArg + "+" + process.argv[i]);
            } 
        } // end if - else (process.argv < 4)
        // Define queryURL
        var queryUrl = "https://www.omdbapi.com/?t=" + secondArg + "&y=&plot=short&tomatoes=true&r=json&apikey=trilogy";

        request(queryUrl, function(error, response, body) {

            // If the request is successful
            if (!error && response.statusCode === 200) {
          
                outputStr = "\n******************************************" + 
                            "\nTitle: " + JSON.parse(body).Title + 
                            "\nYear the movie came out: " + JSON.parse(body).Released + 
                            "\nIMDB Rating: " + JSON.parse(body).imdbRating + 
                            "\nRotten Tomatoes Rating: " + JSON.parse(body).tomatoRating + 
                            "\nCountry where the movie was produced: " + JSON.parse(body).Country + 
                            "\nLanguage of the movie: " + JSON.parse(body).Language + 
                            "\nPlot: " + JSON.parse(body).Plot + 
                            "\nActors: " + JSON.parse(body).Actors + 
                            "\n******************************************\n";
                console.log(outputStr);
                writeToFile(outputStr);
            
            }
        }); // end of request for OMDB API data
    } // end if firstArg === "movie-this"
    else if (firstArg === "do-what-it-says") {
        // Process request to read command from the random.txt file
        fs.readFile("random.txt", "utf8", function(error, data) {
            // If the code experiences any errors it will log the error to the console.
            if (error) {
                return console.log(error);
            }
            // console.log("########### Your Request from the file: #########");
            // console.log(data);
            // console.log("############# Here are your results #############");
            outputStr = "\n########### Your Request from the file: #########" + 
                        "\n" + data + 
                        "\n############# Here are your results #############";

            console.log(outputStr);
            writeToFile(outputStr);
    
            // Then split it by commas (to make it more readable)
            var dataArr = data.split(",");
            firstArg = dataArr[0];
            secondArg = dataArr[1];

            for (var k = 2; k < dataArr.length; k++) {
                secondArg = secondArg + " " + dataArr[k];
            }

            notProcessingFile = false;
            processRequest();

            // We will then re-display the content as an array for later use.
            // console.log(dataArr);

        }); // end of fs.readFile
    } // end if firstArg === "do-what-it-says"
    else {
        // Process Invalid command
        outputStr = "\n############ ERROR: Invalid Command #############\n" + 
                    "Please use the following command format\n" + 
                    "For Twitter Info:\n" + 
                    "  node ./liri.js my-tweets\n" + 
                    "For Song Info:\n" + 
                    "  node ./liri.js spotify-this-song <song title>\n" + 
                    "For Movie Info:\n" + 
                    "  node ./liri.js movie-this <movie title>\n" + 
                    "To read command from a file called random.txt:\n" + 
                    "  node ./liri.js do-what-it-says\n" + 
                    "#################################################\n";
        console.log(outputStr);
        writeToFile(outputStr);
    } // end firstArg if-else chain
} // end function processRequest

processRequest();