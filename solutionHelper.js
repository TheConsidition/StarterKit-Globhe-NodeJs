const fs = require("fs");
const jszip = require("jszip");

/**
 * Opens a zip file and stores the images to the specified path. Returns a list of names of the images
 * @param zipBytes A byte array representing a zip file
 * @param path The path to the folder to unpack the images to
 * @returns {Promise<string[]>}
 */
async function saveImagesToDisk(zipBytes, path) {
    let imageNames = [];
    if(!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
    let zipFile = await jszip.loadAsync(zipBytes);
    zipFile.forEach(function(name, file) {
        imageNames.push(name);
        zipFile.file(name).async("uint8array").then(function(data) {
            fs.writeFileSync(path + "/" + name, data)
        });
    });

    return imageNames;
}

/**
 * Clears the specified folder of all .jpg images
 * @param path The path to the folder to clear
 */
function clearImagesFromFolder(path) {
    fs.readdir(path, (err, files) => {
        if(err) {
            console.log("Could not clear folder " + path);
            console.log(err);
            return;
        }

        files.forEach(file => {
            if(file.includes(".jpg")) {
                fs.unlinkSync(path + "/" + file);
            }
        })
    });
}

/**
 * Prints any errors encountered in the solution
 * @param response The response for the solution
 */
function printErrors(response) {
    if (response.errors == null || response.errors.length == 0) return;

    console.log("Encountered some errors with the solution:");
    response.errors.forEach(error => {
        console.log(error);
    });
}

/**
 * Prints the total score and any scores for images in the solution
 * @param response The response for the solution
 */
function printScores(response) {
    console.log("Total score: " + response.totalScore);
    response.imageScores.forEach(imageScore => {
        console.log("Image " + imageScore.imageName + " got a score of " + imageScore.score);
    });
}

module.exports = {
    saveImagesToDisk, printErrors, printScores, clearImagesFromFolder
};