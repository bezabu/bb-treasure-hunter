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

//load images
let playerLoad = 0;
let imgPlayer = new Image(); // Create new img element
imgPlayer.src = "../assets/images/tree02_placeholder.png"; // Set source path
imgPlayer.onload = () => {
    //tree image is loaded
    playerLoad = 1;
};
let treeLoad = 0;
let imgTree = new Image(); // Create new img element
imgTree.src = "../assets/images/tree02_placeholder.png"; // Set source path
imgTree.onload = () => {
    //tree image is loaded
    treeLoad = 1;
};
let rockLoad = 0;
let imgRock = new Image(); // Create new img element
imgRock.src = "../assets/images/rock_placeholder2.png"; // Set source path
imgRock.onload = () => {
    //rock image is loaded
    rockLoad = 1;
};
//object for storing the cursor position
let mousePosition = {
    x: 0,
    y: 0
};

// set terrain map variables
let mapSize = 30;
let maxHeight = 30;
let rows = mapSize + 1;
let columns = mapSize + 1;
let tileWidth = 32;
let tileHeight = tileWidth / 2;

//player object
let player = {
    playerId: 1,
    playerX: Math.ceil(columns / 2) + 1,
    playerY: 2,
    playerOx: 22,
    playerOy: 45
};
let moveAmount = 0.05;

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

//create the draw list object type
function DrawObject(newType, newX, newY, newOx, newOy) {
    this.type = newType;
    this.x = newX;
    this.y = newY;
    this.xo = newOx;
    this.yo = newOy;
}
//create an object for the player in the drawlist
let playerDrawObject = new DrawObject(imgPlayer, player.playerX, player.playerY, player.playerOx, player.playerOy);
drawList.push(playerDrawObject);

//generate terrain height map & feature map
let mapMargin = 3;
for (let n = 0; n < rows - 1; n++) {
    for (let m = 0; m < columns - 1; m++) {
        heightMap[n][m] = Math.floor(Math.random() * maxHeight);
        //console.log(`Cell ${n},${m} height value ${terrain[n][m]}`);
        if (myGetRandomInt(3) > 2 && n > mapMargin && n < rows - mapMargin && m > mapMargin && m < columns - mapMargin) {
            //one in 4 chance to make a tree
            featureMap[n][m] = 1;
            //enter the object in the drawobject list
            let entry = new DrawObject(imgTree, n, m, 22, 45);
            drawList.push(entry);
            console.log(`New tree, ${entry} at ${n},${m}`);
            //console.log(`New tree, ${entry} at ${n},${m}`);
        } else {
            if (myGetRandomInt(4) > 3 && n > mapMargin && n < rows - mapMargin && m > mapMargin && m < columns - mapMargin) {
                featureMap[n][m] = 2;
                //enter the object in the drawobject list
                let entry = new DrawObject(imgRock, n, m, 25, 35);
                drawList.push(entry);
                console.log(`New rock, ${entry} at ${n},${m}`);
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
        avgHeight = myGetMean(heightMap[n - 1][m - 1],
            heightMap[n][m - 1],
            heightMap[n + 1][m - 1],
            heightMap[n - 1][m],
            heightMap[n + 1][m],
            heightMap[n - 1][m + 1],
            heightMap[n][m + 1],
            heightMap[n + 1][m + 1]);
        smoothMap[n][m] = avgHeight;

    }
}
for (let n = 1; n < rows - 1; n++) {
    for (let m = 1; m < columns - 1; m++) {
        heightMap[n][m] = smoothMap[n][m];

    }
}

sortImages();

//functions
//Isometric conversion functions
//get isometric x coordinate
function getIsoX(x, y, tileWidth, tileHeight) {
    let isoX = ((x - y) * tileWidth);
    return isoX;
}
//get isometric y coordinate
function getIsoY(x, y, tileWidth, tileHeight) {
    let isoY = ((x + y) * tileHeight);
    return isoY;
}
//get original x coordinate from isometric coordinates
function inverseIsoX(x, y, tileWidth, tileHeight) {
    halfTileWidth = tileWidth / 2;
    halfTileHeight = tileHeight / 2;
    let mapX = (x / halfTileWidth + (y / halfTileHeight)) / 2;
    return mapX;
}
//get original y coordinate from isometric coordinates
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
        xScreenOffset += moveAmount * tileWidth * 2;
        console.log(`${eventKey}, new X: ${player.playerX}.`);
    }
    if (eventKey === "ArrowRight") {
        player.playerX += moveAmount;
        player.playerY -= moveAmount;
        xScreenOffset -= moveAmount * tileWidth * 2;
        console.log(`${eventKey}, new X: ${player.playerX}.`);
    }
    if (eventKey === "ArrowUp") {
        player.playerX -= moveAmount;
        player.playerY -= moveAmount;
        yScreenOffset += moveAmount * tileWidth;
        console.log(`${eventKey}, new Y: ${player.playerY}.`);
    }
    if (eventKey === "ArrowDown") {
        player.playerX += moveAmount;
        player.playerY += moveAmount;
        yScreenOffset -= moveAmount * tileWidth;
        console.log(`${eventKey}, new Y: ${player.playerY}.`);
    }
}
function updatePlayerDrawObject() {
    //update the position of the player in the player draw object
    playerDrawObject.x = player.playerX;
    playerDrawObject.y = player.playerY;
}
function drawImages() {
    for (let i = 0; i < drawList.length; i++) {
        //cycle through drawobjects
        //call the drawimage

        drawThis(drawList[i].type, drawList[i].x, drawList[i].y, drawList[i].xo, drawList[i].yo);
        //console.log(`draw ${i}: ${drawList[i].y}`);
    }
}
//sort images
function sortImages() {
    drawList.sort(function (a, b) { return getIsoY(a.x, a.y, tileWidth, tileHeight) - getIsoY(b.x, b.y, tileWidth, tileHeight); });
    //getIsoY(a.x,a.y,tileWidth,tileHeight)
}
//draw an image
function drawThis(imageToDraw, x, y, originX, originY) {
    ctx.drawImage(imageToDraw, getIsoX(x, y, tileWidth, tileHeight) + xScreenOffset - originX, getIsoY(x, y, tileWidth, tileHeight) + yScreenOffset - originY + (tileHeight));
    //console.log(`draw ${imageToDraw} at ${x},${y}`);
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
            isox = getIsoX(n, m, tileWidth, tileHeight);
            isoy = getIsoY(n, m, tileWidth, tileHeight);
            //if (getIsoX(n, m, tileWidth, tileHeight) > 0 && getIsoY(n, m, tileWidth, tileHeight) > 0 && getIsoX(n + 1, m + 1, tileWidth, tileHeight) < CanvasWidth && getIsoY(n + 1, m + 1, tileWidth, tileHeight) < CanvasHeight) {
            ctx.beginPath();
            ctx.moveTo(getIsoX(n, m, tileWidth, tileHeight) + xScreenOffset, getIsoY(n, m, tileWidth, tileHeight) - heightOffSet + yScreenOffset);
            ctx.lineTo(getIsoX(n + 1, m, tileWidth, tileHeight) + xScreenOffset, getIsoY(n + 1, m, tileWidth, tileHeight) - heightOffSetNextX + yScreenOffset);
            ctx.lineTo(getIsoX(n + 1, m + 1, tileWidth, tileHeight) + xScreenOffset, getIsoY(n + 1, m + 1, tileWidth, tileHeight) - heightOffSetNextXY + yScreenOffset);
            //ctx.lineTo((n * tileWidth) + tileWidth, (m * tileWidth) + tileWidth);
            ctx.stroke();
            //}

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
//draw player
function playerDraw(drawObject, terrain) {
    const canvas = document.getElementById("game-area");
    const ctx = canvas.getContext("2d");
    let yOffset = 0;
    yOffset = terrain[Math.floor(drawObject.playerX / tileWidth)][Math.floor(drawObject.playerY / tileWidth)];
    if (canvas.getContext) {
        ctx.fillStyle = "#ff00ff";
        ctx.fillRect(getIsoX(drawObject.playerX, drawObject.playerY, tileWidth, tileWidth / 2) + xScreenOffset, getIsoY(drawObject.playerX, drawObject.playerY, tileWidth, tileWidth / 2) - yOffset + yScreenOffset, 50, 50);
        //ctx.fillRect(drawObject.playerX, drawObject.playerY - yOffset, 50, 50);
        console.log(`draw player at ${drawObject.playerX}, ${drawObject.playerY}`);
    }
}


function gameLoop() {
    clearCanvas();
    drawBackground();
    drawTerrain();
    updatePlayerDrawObject();
    sortImages();
    drawImages();
    //playerDraw(player, heightMap);
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
