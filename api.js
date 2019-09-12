let axios = require("axios");
const BASE_PATH = "https://api.theconsidition.se/api/game";

/**
 * Closes any active game and starts a new one, returning an object with information about the game
 * @param apiKey The api key for this team
 * @returns {Promise<null|{gameId, numberOfRounds, imagesPerRound}>}
 */
async function initGame(apiKey) {
    let config = {
        headers: {
            "x-api-key": apiKey,
        }
    };
    try {
        let response = await axios.get(BASE_PATH + "/init", config);
        return response.data;
    } catch(err) {
        console.log("Fatal Error: could not start a new game");
        if(err.response) {
            console.log("Error: " + err.response.status + ": " + err.response.data);
        } else {
            console.log("Error: " + err.message);
        }
        return null;
    }
}

/**
 * Gets a zip-file containing images for the current round and returns an array of bytes representing the file.
 * Tries fetching the zip file three times
 * @param apiKey The api key for this team
 * @returns {Promise<null|ByteArray>}
 */
async function getImages(apiKey) {
    let config = {
        headers: {
            "x-api-key": apiKey,
        },
        responseType: "arraybuffer",
        responseEncoding: null,
    };
    let tries = 1;
    while(tries <= 3) {
        try {
            let response = await axios.get(BASE_PATH + "/images", config);
            return response.data;
        } catch(err) {
            if(err.response) {
                console.log("Error: " + err.response.status + ": " + err.response.data);
            } else {
                console.log("Error: " + err.message);
            }
            tries++;
        }
    }
    console.log("Fatal Error: could not fetch images");
    return null;
}

/**
 * Posts the solution for evaluation. Returns a summary of the score and game state.
 * Tries to submit the solution three times
 * @param apiKey The api key for this team
 * @param solution The solution for this round of images
 * @returns {Promise<{totalScore, imageScores[], roundsLeft, errors[]}>}
 */
async function scoreSolution(apiKey, solution) {
    let config = {
        headers: {
            "x-api-key": apiKey,
        },
    };
    let tries = 1;
    while(tries <= 3) {
        try {
            let response = await axios.post(BASE_PATH + "/solution", solution, config);
            return response.data;
        } catch(err) {
            if(err.response) {
                console.log("Error: " + err.response.status + ": " + err.response.data);
            } else {
                console.log("Error: " + err.message);
            }
            tries++;
        }
    }
}

module.exports = {
    initGame, getImages, scoreSolution
};