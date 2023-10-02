let canvas = document.getElementById("game-area");
let ctx = canvas.getContext("2d");
let CanvasWidth = canvas.width = 800;
let CanvasHeight = canvas.height = 450;
let xScreenOffset = 0;
let yScreenOffset = 0;
//texting canvas
/*
ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);
ctx.fillStyle = "#ffffff";
ctx.fillRect(CanvasWidth * 0.1, CanvasHeight * 0.1, CanvasWidth * 0.8, CanvasHeight * 0.8);
ctx.fillStyle = "#000000";
ctx.fillRect(CanvasWidth * 0.2, CanvasHeight * 0.2, CanvasWidth * 0.6, CanvasHeight * 0.6);
*/

//player object
let player = {
    playerId: 1,
    playerX: 5,
    playerY: 1
};
let moveAmount = 0.2;

//object for storing the cursor position
let mousePosition = {
    x: 0,
    y: 0
};

// set terrain map variables
let maxHeight = 30;
let rows = 21;
let columns = 21;
let tileWidth = 32;
let tileHeight = tileWidth / 2;

//create arrays for storing terrain height and feature coordinates
let heightMap = [];
let featureMap = [];
let smoothMap = [];

//create the draw list
let drawList = [];

// creating two-dimensional arrays for height, trees and rocks
for (let i = 0; i < rows; i++) {
    heightMap[i] = [];
    featureMap[i] = [];
    smoothMap[i] = [];
    for (let j = 0; j < columns; j++) {
        heightMap[i][j] = j;
        featureMap[i][j] = 0;
        smoothMap[i][j] = 0;
    }
}


//generate terrain height map & feature map
for (let n = 0; n < rows - 1; n++) {
    for (let m = 0; m < columns - 1; m++) {
        heightMap[n][m] = Math.floor(Math.random() * maxHeight);
        //console.log(`Cell ${n},${m} height value ${terrain[n][m]}`);
        if (myGetRandomInt(3) > 2) {
            //one in 4 chance to make a tree
            featureMap[n][m] = 1;
            //enter the object in the drawobject list

            //console.log(`New tree, ${entry} at ${n},${m}`);
        } else {
            if (myGetRandomInt(4) > 3) {
                featureMap[n][m] = 2;
                //enter the object in the drawobject list

                //console.log(`New rock, ${entry} at ${n},${m}`);
                //one in 5 chance to make a rock
            }
        }
    }
}

//smooth heightmap

let avgHeight = 0;
for (let n = 1; n < rows - 2; n++) {
    for (let m = 1; m < columns - 2; m++) {
        avgHeight = myGetMean(heightMap[n - 1][m - 1], heightMap[n][m - 1], heightMap[n + 1][m - 1], heightMap[n - 1][m], heightMap[n + 1][m], heightMap[n - 1][m + 1], heightMap[n][m + 1], heightMap[n + 1][m + 1]);
        smoothMap[n][m] = avgHeight;

    }
}
for (let n = 1; n < rows - 1; n++) {
    for (let m = 1; m < columns - 1; m++) {
        heightMap[n][m] = smoothMap[n][m];

    }
}
//functions
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
//returns a random integer between 0 and maxNum
function myGetRandomInt(maxNum) {
    let randomInt = Math.round(Math.random() * maxNum);
    //console.log(`random int: ${randomInt}`);
    return randomInt;
}
//returns the mean average of 8 inputs
function myGetMean(n1, n2, n3, n4, n5, n6, n7, n8) {
    let myMean = Math.floor((n1, n2, n3, n4, n5, n6, n7, n8) / 8);
    return myMean;
}
//move player
function playerMove(player, eventKey) {
    if (eventKey === "ArrowLeft") {
        player.playerX -= moveAmount;
        player.playerY += moveAmount;
        xScreenOffset += tileWidth;
        console.log(`${eventKey}, new X: ${player.playerX}.`);
    }
    if (eventKey === "ArrowRight") {
        player.playerX += moveAmount;
        player.playerY -= moveAmount;
        xScreenOffset -= tileWidth;
        console.log(`${eventKey}, new X: ${player.playerX}.`);
    }
    if (eventKey === "ArrowUp") {
        player.playerX -= moveAmount;
        player.playerY -= moveAmount;
        yScreenOffset += tileWidth / 2;
        console.log(`${eventKey}, new Y: ${player.playerY}.`);
    }
    if (eventKey === "ArrowDown") {
        player.playerX += moveAmount;
        player.playerY += moveAmount;
        yScreenOffset -= tileWidth / 2;
        console.log(`${eventKey}, new Y: ${player.playerY}.`);
    }
}
//draw terain
function drawTerrain() {
    let heightOffSet = "";
    let heightOffSetNextX = "";
    let heightOffSetNextXY = "";
    for (let n = 1; n < rows - 1; n++) {
        for (let m = 1; m < columns - 1; m++) {
            heightOffSet = heightMap[n][m];
            heightOffSetNextX = heightMap[n + 1][m];
            heightOffSetNextXY = heightMap[n + 1][m + 1];
            getIsoX(n, m, tileWidth, tileWidth / 2);
            getIsoY(n, m, tileWidth, tileWidth / 2);
            ctx.beginPath();
            ctx.moveTo(getIsoX(n, m, tileWidth, tileWidth / 2) + xScreenOffset, getIsoY(n, m, tileWidth, tileWidth / 2) - heightOffSet + yScreenOffset);
            ctx.lineTo(getIsoX(n + 1, m, tileWidth, tileWidth / 2) + xScreenOffset, getIsoY(n + 1, m, tileWidth, tileWidth / 2) - heightOffSetNextX + yScreenOffset);
            ctx.lineTo(getIsoX(n + 1, m + 1, tileWidth, tileWidth / 2) + xScreenOffset, getIsoY(n + 1, m + 1, tileWidth, tileWidth / 2) - heightOffSetNextXY + yScreenOffset);
            //ctx.lineTo((n * tileWidth) + tileWidth, (m * tileWidth) + tileWidth);
            ctx.stroke();
        }
    }
}
//clears the canvas ready for next frame
function clearCanvas() {
    ctx.clearRect(0, 0, CanvasWidth, CanvasHeight);
}
function drawBackground() {
    ctx.fillStyle = "#448A43";
    ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);
}



function gameLoop() {
    clearCanvas();
    drawBackground();
    drawTerrain();
}

setInterval(gameLoop, 40);

//event listeners
//key downs
document.addEventListener('keydown', (event) => {
    //key down
    playerMove(player, event.key);
});
document.addEventListener("mousedown", (evt) => {
    //get mouse position
});
document.addEventListener("mousemove", logMouse);

function logMouse(e) {
    //console.log(`mouse position: ${e.clientX},${e.clientY}`);
    let rect = canvas.getBoundingClientRect();
    mousePosition.x = Math.floor(e.clientX - rect.left);
    mousePosition.y = Math.floor(e.clientY - rect.top);
    console.log(`mouse click at ${mousePosition.x},${mousePosition.y}`);
}
