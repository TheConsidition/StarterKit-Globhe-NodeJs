const api = require('./api');
const solutionHelper = require("./solutionHelper");

// TODO Run 'npm install' to install 'jszip' and 'axios'

const imageFolderPath = 'path/to/imageFolder';  //TODO enter the path to your image folder here
const apiKey = "YOUR-API-KEY-HERE";             //TODO enter your API key here

async function main() {
    const gameInfo = await api.initGame(apiKey);
    if(!gameInfo) {
        return;
    }
    const gameId = gameInfo.gameId;
    let roundsLeft = gameInfo.numberOfRounds;
    console.log("Starting a new game with id: " + gameId);
    console.log("The game has " + roundsLeft + " rounds and " + gameInfo.imagesPerRound + " images per round");
    while(roundsLeft > 0) {
        console.log("Starting new round, " + roundsLeft + " rounds left");
        const zip = await api.getImages(apiKey);
        if(!zip) {
            return;
        }
        const imageNames = await solutionHelper.saveImagesToDisk(zip, imageFolderPath);
        const tArray = imageNames.map(async name => {
            const imagePath = imageFolderPath + "/" + name;
            const imageSolution = await imageAnalyzer(imagePath);
            return {ImageName: name, BuildingPercentage: imageSolution.buildingPercentage,
                RoadPercentage: imageSolution.roadPercentage, WaterPercentage: imageSolution.waterPercentage};
        });
        const imageSolution = await Promise.all(tArray);
        const response = await api.scoreSolution(apiKey, {solutions: imageSolution});
        solutionHelper.printErrors(response);
        solutionHelper.printScores(response);
        roundsLeft = response.roundsLeft;
    }
    solutionHelper.clearImagesFromFolder(imageFolderPath);
}

async function imageAnalyzer(path) {
    /**
     * ----------------------------------------------------
     * TODO Implement your image recognition algorithm here
     * ----------------------------------------------------
     */

    return {buildingPercentage: 30.0, roadPercentage: 30.0, waterPercentage: 30.0};
}

main();