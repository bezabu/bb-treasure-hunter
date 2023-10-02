let canvas = document.getElementById("game-area");
let ctx = canvas.getContext("2d");
let CanvasWidth = canvas.width = 800;
let CanvasHeight = canvas.height = 450;

//texting canvas
ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);
ctx.fillStyle = "#ffffff";
ctx.fillRect(CanvasWidth * 0.1, CanvasHeight * 0.1, CanvasWidth * 0.8, CanvasHeight * 0.8);
ctx.fillStyle = "#000000";
ctx.fillRect(CanvasWidth * 0.2, CanvasHeight * 0.2, CanvasWidth * 0.6, CanvasHeight * 0.6);


// set terrain map variables
let maxHeight = 20;
let rows = 11;
let columns = 11;

//create arrays for storing object coordinates
let heightMap = [];
let featureMap = [];

//create the draw list
let drawList = [];

// creating two-dimensional arrays for height, trees and rocks
for (let i = 0; i < rows; i++) {
    heightMap[i] = [];
    featureMap[i] = [];
    for (let j = 0; j < columns; j++) {
        heightMap[i][j] = j;
        featureMap[i][j] = 0;
    }
}


//generate terrain height map & feature map
for (let n = 0; n < 10; n++) {
    for (let m = 0; m < 10; m++) {
        heightMap[n][m] = Math.floor(Math.random() * maxHeight);
        //console.log(`Cell ${n},${m} height value ${terrain[n][m]}`);
        if (myGetRandomInt(3) > 2) {
            //one in 4 chance to make a tree
            featureMap[n][m] = 1;
            //enter the object in the drawobject list
            
            console.log(`New tree, ${entry} at ${n},${m}`);
        } else {
            if (myGetRandomInt(4) > 3) {
                featureMap[n][m] = 2;
                //enter the object in the drawobject list
                
                console.log(`New rock, ${entry} at ${n},${m}`);
                //one in 5 chance to make a rock
            }
        }
    }
}

//Isometric conversion functions
function getIsoX(x, y, tileWidth, tileHeight) {
    let isoX = ((x - y) * tileWidth);
    return isoX;
}
function getIsoY(x, y, tileWidth, tileHeight) {
    let isoY = ((x + y) * tileHeight);
    return isoY;
}
function inverseIsoX(x, y, tileWidth, tileHeight) {
    halfTileWidth = tileWidth / 2;
    halfTileHeight = tileHeight / 2;
    let mapX = (x / halfTileWidth + (y / halfTileHeight)) / 2;
    return mapX;
}
function inverseIsoY(x, y, tileWidth, tileHeight) {
    halfTileWidth = tileWidth / 2;
    halfTileHeight = tileHeight / 2;
    let mapY = (y / halfTileHeight - (x / halfTileWidth)) / 2;
    return mapY;
}