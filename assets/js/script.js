//initiate canvas
let canvas = document.getElementById("game-area");
let ctx = canvas.getContext("2d");
let CanvasWidth = canvas.width = 800;
let CanvasHeight = canvas.height = 450;
//set view area
let xScreenOffset = 0;
let yScreenOffset = 0;
// identify hot/cold message
let hintMessage = document.getElementById("hint-message");
let hints = ["Red-Hot!", "Boiling", "Hot", "Warm", "Warm", "Lukewarm", "Lukewarm", "Cold", "Cold", "Cold", "Very Cold", "Very Cold", "Extremely Cold", "Freezing", "Absolute Zero"];
let hintColors = ['#FB1300', '#F33C06', '#EC6D0F', '#FA9625', '#F5A537', '#E8C369', '#E5DEAF'];
hintMessage.innerHTML = hints[6];
//load images
let playerLoad = 0;
let imgPlayer = new Image(); // Create new img element
imgPlayer.src = "https://bezabu.github.io/bb-treasure-hunter/assets/images/player_placeholder01.png"; // Set source path
imgPlayer.onload = () => {
    //tree image is loaded
    playerLoad = 1;
};
let treeLoad = 0;
let imgTree = new Image(); // Create new img element
imgTree.src = "https://bezabu.github.io/bb-treasure-hunter/assets/images/tree02_placeholder.png"; // Set source path
imgTree.onload = () => {
    //tree image is loaded
    treeLoad = 1;
};
let rockLoad = 0;
let imgRock = new Image(); // Create new img element
imgRock.src = "https://bezabu.github.io/bb-treasure-hunter/assets/images/rock_placeholder2.png"; // Set source path
imgRock.onload = () => {
    //rock image is loaded
    rockLoad = 1;
};
//object for storing the cursor position
let mousePosition = {
    x: 0,
    y: 0
};
//variables storing key presses
let leftKey = 0;
let rightKey = 0;
let upKey = 0;
let downKey = 0;
let keyPressed = 0;
let touch = 0;
let moving = {
    up: 0,
    down: 0,
    left: 0,
    right: 0
};
// set terrain map variables
let mapSize = 40;
let maxHeight = 30;
let rows = mapSize + 1;
let columns = mapSize + 1;
let tileWidth = 32;
let tileHeight = Math.floor(tileWidth / 2);
let treasureCount = 3;

//player object
let player = {
    playerId: 1,
    playerX: Math.ceil(columns / 2) + 1,
    playerY: 4,
    playerOx: 32,
    playerOy: 53,
    animation: 0
};
let playerAnimateCount = 0;
let moveAmount = 0.05;
xScreenOffset = -200;
yScreenOffset = -200;

//create arrays for storing terrain height and feature coordinates
let heightMap = [];
let featureMap = [];
let smoothMap = [];

//create the draw list
let drawList = [];

// creating two-dimensional arrays for height, movement, trees and rocks
/*
heightmap has a simply height value to add after isometric conversion
featuremap assigns an integer based on what the tile contains:
0   nothing
1   a tree
2   a rock
3   water tile
4   treasure location
smoothmap is a spare array to contain the smoothed out version of the
heightmap during the process
*/
for (let i = 0; i < rows; i++) {
    heightMap[i] = [];
    featureMap[i] = [];
    smoothMap[i] = [];
    for (let j = 0; j < columns; j++) {
        heightMap[i][j] = 0;
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
        if (n != player.playerX && m != player.playerY) {
            if (myGetRandomInt(3) > 2 && n > mapMargin && n < rows - mapMargin && m > mapMargin && m < columns - mapMargin) {
                //one in 4 chance to make a tree
                featureMap[n][m] = 1;
                //enter the object in the drawobject list
                let entry = new DrawObject(imgTree, n, m, 22, 45);
                drawList.push(entry);
                //console.log(`New tree, ${entry} at ${n},${m}`);
                //console.log(`New tree, ${entry} at ${n},${m}`);
            } else {
                if (myGetRandomInt(4) > 3 && n > mapMargin && n < rows - mapMargin && m > mapMargin && m < columns - mapMargin) {
                    featureMap[n][m] = 2;
                    //enter the object in the drawobject list
                    let entry = new DrawObject(imgRock, n, m, 25, 35);
                    drawList.push(entry);
                    //console.log(`New rock, ${entry} at ${n},${m}`);
                    //console.log(`New rock, ${entry} at ${n},${m}`);
                    //one in 5 chance to make a rock
                }
            }
        }
    }
}




//get average height of surrounding tiles and store in smoothmap
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
//replace heightmap with the smooth version
for (let n = 1; n < rows - 1; n++) {
    for (let m = 1; m < columns - 1; m++) {
        heightMap[n][m] = smoothMap[n][m];
    }
}
//use smoothmap to store color info
for (let n = 1; n < rows - 1; n++) {
    for (let m = 1; m < columns - 1; m++) {
        let colString1 = (68 + myGetRandomInt(10) - myGetRandomInt(10)).toString();
        let colString2 = (138 + myGetRandomInt(10) - myGetRandomInt(10)).toString();
        let colString3 = (67 + myGetRandomInt(10) - myGetRandomInt(10)).toString();
        //console.log("rgb(" + colString1 + "," + colString2 + "," + colString3 + ")");
        let fullCol = "rgb(" + colString1 + "," + colString2 + "," + colString3 + ")";
        smoothMap[n][m] = fullCol;
    }
}
//set edge tiles to 0 height and mark them as water
for (let n = 1; n < rows; n++) {
    for (let m = 1; m < columns; m++) {
        if (n == 1 || m == 1 || n == rows - 1 || m == columns - 1) {
            heightMap[n][m] = 0;
            featureMap[n][m] = 3;
        }
    }
}
//distribute treasures
let treasureList = [];
for (i = treasureCount; i > 0; i--) {
    let treasureAssigned = 0;
    while (treasureAssigned == 0) {
        console.log('Assigning treasure...');
        let thisX = Math.floor(myGetRandomInt(rows - 8) + 4);
        let thisY = Math.floor(myGetRandomInt(columns - 8) + 4);
        if (featureMap[thisX][thisY] == 0) {
            featureMap[thisX][thisY] = 4;
            let thisTreasure = {
                id: i,
                x: thisX,
                y: thisY
            };
            treasureList.push(thisTreasure);
            console.log(`treasure hidden at ${thisX},${thisY}`);
            treasureAssigned = 1;
        }
    }
}
console.log(treasureList);
sortImages();

//functions
//Isometric conversion functions
//get isometric x coordinate
function getIsoX(x, y, tileWidth, tileHeight) {
    let isoX = ((x - y) * (tileWidth));
    return isoX;
}
//get isometric y coordinate
function getIsoY(x, y, tileWidth, tileHeight) {
    let isoY = ((x + y) * (tileHeight));
    return isoY;
}
/*
//get original x coordinate from isometric coordinates
function inverseIsoX(x, y, tileWidth, tileHeight) {
    halfTileWidth = tileWidth / 2;
    halfTileHeight = tileHeight / 2;
    let mapX = (x / halfTileWidth + y / halfTileHeight) / 2;
    return mapX;
}
//get original y coordinate from isometric coordinates
function inverseIsoY(x, y, tileWidth, tileHeight) {
    halfTileWidth = tileWidth / 2;
    halfTileHeight = tileHeight / 2;
    let mapY = (y / halfTileHeight - (x / halfTileWidth)) / 2;
    return mapY;
}
*/
//get original x coordinate from isometric coordinates
function inverseIsoX(x, y, tileWidth, tileHeight) {
    x = x - xScreenOffset;
    y = y - yScreenOffset;
    let mapX = (x / (tileWidth * 2) + y / (tileHeight * 2)) - 0.5;
    return mapX;
}
//get original y coordinate from isometric coordinates
function inverseIsoY(x, y, tileWidth, tileHeight) {
    x = x - xScreenOffset;
    y = y - yScreenOffset;
    let mapY = (y / (tileHeight * 2) - x / (tileWidth * 2)) - 0.5;
    return mapY;
}
//returns a random integer between 0 and maxNum
function myGetRandomInt(maxNum) {
    let randomInt = Math.round(Math.random() * maxNum);
    //console.log(`random int: ${randomInt}`);
    return randomInt;
}
//get the distance between two points
function myGetDistance(x1, y1, x2, y2) {
    let myDistance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return myDistance;
}
//get the angle between two points
function getAngleDeg(x1, y1, x2, y2) {
    // angle in degrees
    let angleDeg = (Math.atan2(x2 - x1, y2 - y1) * 180 / Math.PI) + 180;
    return angleDeg;
}
//returns the mean average of 8 inputs
function myGetMean(n1, n2, n3, n4, n5, n6, n7, n8) {
    let myMean = Math.floor((n1, n2, n3, n4, n5, n6, n7, n8) / 8);
    return myMean;
}
//collision check
function colCheck(x, y) {
    if (featureMap[Math.floor(x + 0.5)][Math.floor(y + 0.5)] == 2 || featureMap[Math.floor(x + 0.5)][Math.floor(y + 0.5)] == 3) {
        //return true of the intended destination is inside a tile with an obsticle
        return true;
    }
}
//move player
function playerMove(player, eventKey) {
    if (leftKey) {
        moveLeft();
    }
    if (rightKey) {
        moveRight();
    }
    if (upKey) {
        moveUp();
    }
    if (downKey) {
        moveDown();
    }
    if (!downKey && !upKey && !leftKey && !rightKey) keyPressed = 0;
}
function moveLeft() {
    if (!colCheck(player.playerX - moveAmount, player.playerY + moveAmount)) {
        moving.left = 1;
        player.playerX -= moveAmount;
        player.playerY += moveAmount;
        xScreenOffset += moveAmount * tileWidth * 2;
    }
}
function moveRight() {
    if (!colCheck(player.playerX + moveAmount, player.playerY - moveAmount)) {
        moving.right = 1;
        player.playerX += moveAmount;
        player.playerY -= moveAmount;
        xScreenOffset -= moveAmount * tileWidth * 2;
    }
}
function moveUp() {
    if (!colCheck(player.playerX - moveAmount, player.playerY - moveAmount)) {
        moving.up = 1;
        player.playerX -= moveAmount;
        player.playerY -= moveAmount;
        yScreenOffset += moveAmount * tileWidth;
    }
}
function moveDown() {
    if (!colCheck(player.playerX + moveAmount, player.playerY + moveAmount)) {
        moving.down = 1;
        player.playerX += moveAmount;
        player.playerY += moveAmount;
        yScreenOffset -= moveAmount * tileWidth;
    }
}
//get the mouse coordinates
function logMouse(e) {
    //console.log(`mouse position: ${e.clientX},${e.clientY}`);
    let rect = canvas.getBoundingClientRect();
    mousePosition.x = Math.floor(e.clientX - rect.left);
    mousePosition.y = Math.floor(e.clientY - rect.top);
    //console.log(`mouse click at ${mousePosition.x},${mousePosition.y}`);
    //console.log(getAngleDeg(player.playerX, player.playerY, inverseIsoX(mousePosition.x, mousePosition.y, tileWidth, tileHeight), inverseIsoY(mousePosition.x, mousePosition.y, tileWidth, tileHeight)));
}
function mouseMove() {
    let moveAngle = (getAngleDeg(player.playerX, player.playerY, inverseIsoX(mousePosition.x, mousePosition.y, tileWidth, tileHeight), inverseIsoY(mousePosition.x, mousePosition.y, tileWidth, tileHeight)));
    //console.log(`x:${(inverseIsoX(mousePosition.x, mousePosition.y, tileWidth, tileHeight))},${inverseIsoY(mousePosition.x, mousePosition.y, tileWidth, tileHeight)}`);
    //console.log(`player: ${player.playerX},${player.playerY}`);
    if (moveAngle <= 112 || moveAngle > 337) {
        //move up
        moveUp();
    } else if (moveAngle > 157 && moveAngle <= 292) {
        //move down
        moveDown();
    }
    if (moveAngle > 67 && moveAngle <= 202) {
        //left
        moveLeft();
    } else if (moveAngle > 247 || moveAngle <= 22) {
        //move right
        moveRight();
    }
}
function updatePlayerDrawObject() {
    //update the position of the player in the player draw object
    playerDrawObject.x = player.playerX;
    playerDrawObject.y = player.playerY;
    if (upKey) player.animation = 1;
    if (rightKey) player.animation = 3;
    if (downKey) player.animation = 5;
    if (leftKey) player.animation = 7;
    if (leftKey && upKey) player.animation = 0;
    if (rightKey && upKey) player.animation = 2;
    if (rightKey && downKey) player.animation = 4;
    if (leftKey && downKey) player.animation = 6;
    playerAnimateCount += 0.5;
    if (playerAnimateCount > 7) playerAnimateCount = 0;
}
//check distance to nearest treasure
function checkHint() {
    //check distance
    //find closest treasure
    let dist = "";
    let shortestDist = 999999;
    for (index in treasureList) {
        dist = myGetDistance(player.playerX, player.playerY, treasureList[index].x, treasureList[index].y);
        //console.log(`distance to treasure ${treasureList[index].id}, ${dist}`);
        if (dist < shortestDist) {
            shortestDist = dist;
            nearestTreasure = treasureList[index].id;
        }
    }
    if (Math.floor(shortestDist / 2) <= hints.length - 1) {
        hintMessage.innerHTML = hints[Math.floor(shortestDist / 2)];
        hintMessage.parentNode.style.backgroundColor = hintColors[Math.floor(shortestDist / 2)];
        //console.log(hints.length);
    } else {
        hintMessage.innerHTML = hints[hints.length - 1];
        hintMessage.parentNode.style.backgroundColor = hintColors[hintColors.length - 1];
    }
    //console.log(hints[Math.floor(shortestDist / 2)]);
    //console.log(hints[hints.length - 1]);
}
//cycle through drawlist
function drawImages() {
    for (let i = 0; i < drawList.length; i++) {
        //call the drawimage
        if (drawList[i].type == imgPlayer) {
            //special code for animating the player
            drawPlayer(drawList[i].type, drawList[i].x, drawList[i].y, drawList[i].xo, drawList[i].yo);
        } else {
            drawThis(drawList[i].type, drawList[i].x, drawList[i].y, drawList[i].xo, drawList[i].yo);
        }
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
//draw the player
function drawPlayer(imageToDraw, x, y, originX, originY, animation) {
    let drawX = getIsoX(x, y, tileWidth, tileHeight) + xScreenOffset - originX;
    let drawY = getIsoY(x, y, tileWidth, tileHeight) + yScreenOffset - originY + (tileHeight);
    ctx.drawImage(imageToDraw, Math.floor(playerAnimateCount) * 64, (player.animation + (keyPressed * 8)) * 64, 64, 64, drawX, drawY, 64, 64);
}
//draw terain
function drawTerrain() {
    let heightOffSet = "";
    let heightOffSetNextX = "";
    let heightOffSetNextXY = "";
    let heightOffSetNextY = "";
    for (let n = 1; n < rows - 1; n++) {
        for (let m = 1; m < columns - 1; m++) {
            heightOffSet = heightMap[n][m];
            heightOffSetNextX = heightMap[n + 1][m];
            heightOffSetNextXY = heightMap[n + 1][m + 1];
            heightOffSetNextY = heightMap[n][m + 1];
            isox = getIsoX(n, m, tileWidth, tileHeight);
            isoy = getIsoY(n, m, tileWidth, tileHeight);
            //if (getIsoX(n, m, tileWidth, tileHeight) > 0 && getIsoY(n, m, tileWidth, tileHeight) > 0 && getIsoX(n + 1, m + 1, tileWidth, tileHeight) < CanvasWidth && getIsoY(n + 1, m + 1, tileWidth, tileHeight) < CanvasHei{ght) {
            //draw tile
            if (featureMap[n][m] == 3) {
                ctx.fillStyle = "#3CC3DB";
            } else {

                //ctx.fillStyle = fullCol;
                //console.log(smoothMap[n][m]);
                //ctx.fillStyle = "#448A43";
                ctx.fillStyle = smoothMap[n][m];
            }

            ctx.beginPath();
            ctx.moveTo(getIsoX(n, m, tileWidth, tileHeight) + xScreenOffset, getIsoY(n, m, tileWidth, tileHeight) - heightOffSet + yScreenOffset);
            ctx.lineTo(getIsoX(n + 1, m, tileWidth, tileHeight) + xScreenOffset, getIsoY(n + 1, m, tileWidth, tileHeight) - heightOffSetNextX + yScreenOffset);
            ctx.lineTo(getIsoX(n + 1, m + 1, tileWidth, tileHeight) + xScreenOffset, getIsoY(n + 1, m + 1, tileWidth, tileHeight) - heightOffSetNextXY + yScreenOffset);
            ctx.lineTo(getIsoX(n, m + 1, tileWidth, tileHeight) + xScreenOffset, getIsoY(n, m + 1, tileWidth, tileHeight) - heightOffSetNextY + yScreenOffset);
            //ctx.lineTo((n * tileWidth) + tileWidth, (m * tileWidth) + tileWidth);
            ctx.fill();
            //draw tile outline
            ctx.strokeStyle = "#000000";
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
    ctx.fillStyle = "#3CC3DB";
    ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);
}

//main game loop
let gameTimer = 0;
function gameLoop() {
    clearCanvas();
    if (touch == 1) mouseMove();
    if (touch == 0 && keyPressed == 0) {
        moving.up = 0;
    }
    playerMove(player);
    checkHint();
    drawBackground();
    drawTerrain();
    updatePlayerDrawObject();
    sortImages();
    drawImages();
    gameTimer++;
    console.log(touch);
}
//run gameLoop 25 times per second (every 40 milliseconds)
setInterval(gameLoop, 40);

//event listeners
//key downs
document.addEventListener('keydown', (event) => {
    //key down
    //playerMove(player, event.key);
    if (event.key == "ArrowLeft") leftKey = 1;
    if (event.key == "ArrowRight") rightKey = 1;
    if (event.key == "ArrowUp") upKey = 1;
    if (event.key == "ArrowDown") downKey = 1;
    keyPressed = 1;
});
document.addEventListener('keyup', (event) => {
    //key up
    if (event.key == "ArrowLeft") {
        leftKey = 0;
    }
    if (event.key == "ArrowRight") {
        rightKey = 0;
    }
    if (event.key == "ArrowUp") {
        upKey = 0;
    }
    if (event.key == "ArrowDown") {
        downKey = 0;
    }
});
document.addEventListener("mousemove", logMouse);

document.addEventListener("mousedown", (evt) => {
    //get mouse position and use it
    //mouseMove();
    //console.log(`mouse click at ${mousePosition.x},${mousePosition.y}`);
});
document.addEventListener("pointerdown", (evt) => {
    //console.log("mouse click");
    //get mouse position

    logMouse(evt);
    console.log(`mobile touch 1 at ${mousePosition.x},${mousePosition.y}`);
    touch = 1;
});
document.addEventListener("pointerup", (evt) => {
    //console.log("mouse click");
    //get mouse position

    //logMouse(evt);
    //console.log(`mobile touch 1 at ${mousePosition.x},${mousePosition.y}`);
    touch = 0;
});
document.addEventListener("touchstart", (evt) => {

    //logMouse(evt);
    //console.log(`mobile touch 2 at ${mousePosition.x},${mousePosition.y}`);
    touch = 1;
});
document.addEventListener("touchmove", (touch) => {

    logMouse(touch);
    console.log(`mobile touch 3 at ${mousePosition.x},${mousePosition.y}`);
    //touch = 1;

});
document.addEventListener("touchend", (evt) => {

    //logMouse(evt);
    //console.log(`mobile touch at ${mousePosition.x},${mousePosition.y}`);
    touch = 0;

});

document.addEventListener("DOMContentLoaded", function () {
    let resetButton = document.getElementById('reset-button');


    resetButton.addEventListener("click", function () {

        //reload the page
        window.location.reload();
        return false;

    });



});
