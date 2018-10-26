#liri-node-app

#Table Of Contents
Application Introduction
Instructions
Minimum Requirements
Example Results
#1. Application Introduction
This application uses node.js to provide a command line interface to do the following: - Dump the 20 most recent tweets from my tweet account - Using Spotify, provide specific info about a specified song - Using OMDB, provide specific movieinfo about a specified movie - Read in a command using the above format from a file called "random.txt"

If the command doe not meet specific format, and error will be displayed showing how to format the command for all the options described above.

Results of the command and teh command itself will be printed in teh terminal. It will also be written to a log.txt file for review at a later time.

#2. Instructions
The application will respond to the following commands:

For Twitter Info:
    node ./liri.js my-tweets
For Song Info:
    node ./liri.js spotify-this-song <song title>
For Movie Info:
    node ./liri.js movie-this <movie title>
To read command from a file called "random.txt":
    node ./liri.js do-what-it-says
#3. Minimum Requirements
In order to run this application, you will need the following utilities and packages:

node.js

The following npm packages:

"dotenv": "^6.0.0",
"node-spotify-api": "^1.0.7",
"request": "^2.87.0",
"twitter": "^1.7.1"
A .env file with the following information:

        # Spotify API keys

        SPOTIFY_ID=your-spotify-id
        SPOTIFY_SECRET=your-spotify-secret

        # Twitter API keys

        TWITTER_CONSUMER_KEY=your-twitter-consumer-key
        TWITTER_CONSUMER_SECRET=your-twitter-consumer-secret
        TWITTER_ACCESS_TOKEN_KEY=your-access-token-key
        TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret
