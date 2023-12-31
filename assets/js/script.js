/*jshint esversion: 7 */
//initiate canvas
let canvas = document.getElementById("game-area");
let ctx = canvas.getContext("2d");
let CanvasWidth = canvas.width = 800;
let CanvasHeight = canvas.height = 450;
//set view area
let xScreenOffset = -200; //added to all draw functions to simulate a 'camera'
let yScreenOffset = -200;
let gameState = 0; //wether or not to check for player input
// get hint area in HTML and set hot/cold hint messages/colours
let hintMessage = document.getElementById("hint-message");
let hints = ["Red-Hot!", "Boiling", "Hot", "Warm", "Warm", "Lukewarm",
    "Lukewarm", "Cold", "Cold", "Cold", "Very Cold", "Very Cold",
    "Extremely Cold", "Freezing", "Absolute Zero"];
let hintColors = ['#FB1300', '#F33C06', '#EC6D0F', '#FA9625', '#F5A537',
    '#E8C369', '#E5DEAF', '#AFB6E5', '#4183E8', '#047EF9', '#73D1E1', '#99E4E7',
    '#BAEAE8', '#E6F5F5', '#ffffff'];
hintMessage.innerHTML = hints[6];

//load images
let gitHubUrl = "https://bezabu.github.io/bb-treasure-hunter/";
let imgPlayer = new Image(); // Create new img element
imgPlayer.src = gitHubUrl + "assets/images/player_placeholder01.png";
let imgTree = new Image(); // Create new img element
imgTree.src = gitHubUrl + "assets/images/tree_sheet2.png";
let imgRock = new Image(); // Create new img element
imgRock.src = gitHubUrl + "assets/images/rock_01_sheet.png";
let imgHole = new Image(); // Create new img element
imgHole.src = gitHubUrl + "assets/images/hole2.png";

//variables for storing player input
let leftKey = 0;
let rightKey = 0;
let upKey = 0;
let downKey = 0;
let spaceKey = 0;
let leftButton = 0;
let rightButton = 0;
let upButton = 0;
let downButton = 0;
let keyPressed = 0;
let buttonPressed = 0;
let isMoving = 0; //used for sprite animations
let moving = {
    up: 0,
    down: 0,
    left: 0,
    right: 0
};

let started = false;
// set terrain generation variables
let mapSize = 40;
let maxHeight = 30;
let rows = mapSize + 1;
let columns = mapSize + 1;
let tileWidth = 32;
let tileHeight = Math.floor(tileWidth / 2);
let treasureCount = 3; //how many treasures
let nearestTreasure = "";
let treasureFound = 0;
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
let digLog = 0;

//arrays for storing terrain height and feature coordinates
let heightMap = [];
let featureMap = [];
let smoothMap = []; //used to smooth terrain and then to store colours
//create the draw list and object type
let drawList = []; //list of all items to draw
function DrawObject(newType, newX, newY, newOx, newOy, newVa, newWid, newHei) {
    this.type = newType;
    this.x = newX; //x coord
    this.y = newY; //y coord
    this.xo = newOx; //x offset
    this.yo = newOy; //y offset
    this.va = newVa; //variant
    this.wid = newWid; //width of sprite
    this.hei = newHei; //height of sprite
}
// create two-dimensional arrays for height, movement, trees and rocks
/*
featuremap assigns an integer based on what the tile contains:
0   nothing
1   a tree
2   a rock
3   water tile
4   treasure location
5   dug up hole
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

//create an object for the player in the drawlist
let playerDrawObject = new DrawObject(imgPlayer, player.playerX, player.playerY,
    player.playerOx, player.playerOy);
drawList.push(playerDrawObject);

//generate terrain height map & feature map
let mapMargin = 3;
for (let n = 0; n < rows - 1; n++) {
    for (let m = 0; m < columns - 1; m++) {
        heightMap[n][m] = myGetRandomInt(maxHeight);
        if (n != player.playerX && m != player.playerY) {
            //chance to generate a tree, but only if not near edges of map
            if (myGetRandomInt(3) > 2 && n > mapMargin &&
                n < rows - mapMargin && m > mapMargin && m < columns -
                mapMargin) {
                featureMap[n][m] = 1;
                //enter the object in the drawobject list
                let entry = new DrawObject(imgTree, n, m, 34, 102,
                    myGetRandomInt(3), 70, 116);
                drawList.push(entry);
            } else {
                //chance to generate a rock, but only if not near edges of map
                if (myGetRandomInt(4) > 3 && n > mapMargin && n < rows -
                    mapMargin && m > mapMargin && m < columns - mapMargin) {
                    featureMap[n][m] = 2;
                    //enter the object in the drawobject list
                    let entry = new DrawObject(imgRock, n, m, 31, 41,
                        myGetRandomInt(2), 54, 52);
                    drawList.push(entry);
                }
            }
        }
    }
}
//get average height of surrounding tiles
for (let n = 1; n < rows - 2; n++) {
    for (let m = 1; m < columns - 2; m++) {
        let avgHeight = myGetMean(heightMap[n - 1][m - 1],
            heightMap[n][m - 1],
            heightMap[n + 1][m - 1],
            heightMap[n - 1][m],
            heightMap[n + 1][m],
            heightMap[n - 1][m + 1],
            heightMap[n][m + 1],
            heightMap[n + 1][m + 1]);
        smoothMap[n][m] = avgHeight; //store in smoothMap
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
        let colSt1 = (68 + myGetRandomInt(10) - myGetRandomInt(10)).toString();
        let colSt2 = (138 + myGetRandomInt(10) - myGetRandomInt(10)).toString();
        let colSt3 = (67 + myGetRandomInt(10) - myGetRandomInt(10)).toString();
        let fullCol = "rgb(" + colSt1 + "," + colSt2 + "," + colSt3 + ")";
        smoothMap[n][m] = fullCol; //store rgb values in a string for later use
    }
}
//make coasts
for (let n = 1; n < rows; n++) {
    for (let m = 1; m < columns; m++) {
        if (n == 1 || m == 1 || n == rows - 1 || m == columns - 1) {
            heightMap[n][m] = 0; //set edge tiles to 0 height
            featureMap[n][m] = 3; //mark them as water tiles in featureMap
        }
    }
}
//distribute treasures
let treasureList = [];
for (let i = 0; i < treasureCount; i++) {
    let treasureAssigned = 0;
    while (treasureAssigned == 0) {
        let thisX = Math.floor(myGetRandomInt(rows - 8) + 4);
        let thisY = Math.floor(myGetRandomInt(columns - 8) + 4);
        /* check if location suitable and if so, create the treasure, add it 
        to the list and exit the while loop */
        if (featureMap[thisX][thisY] == 0) {
            featureMap[thisX][thisY] = 4;
            let thisTreasure = {
                id: i,
                x: thisX,
                y: thisY
            }; //create an object with the treasure's position on the map
            treasureList.push(thisTreasure);
            treasureAssigned = 1;
        }
    }
}
sortImages();

//functions
//Isometric conversion functions
function getIsoX(x, y, tileWidth, tileHeight) {
    let isoX = ((x - y) * (tileWidth / 2)) * 2;
    return isoX; //gets isometric x coordinate
    //isometric conversion formula from Clint Bellanger tutorial
}
function getIsoY(x, y, tileWidth, tileHeight) {
    let isoY = ((x + y) * (tileHeight / 2)) * 2;
    return isoY; //gets isometric y coordinate
    //isometric conversion formula from Clint Bellanger tutorial
}
//returns a random integer between 0 and maxNum
function myGetRandomInt(maxNum) {
    let randomInt = Math.round(Math.random() * maxNum);
    return randomInt;
}
//get the distance between two points
function myGetDistance(x1, y1, x2, y2) {
    let myDistance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return myDistance;
}
//returns the mean average of 8 inputs
function myGetMean(n1, n2, n3, n4, n5, n6, n7, n8) {
    let myMean = Math.floor((n1, n2, n3, n4, n5, n6, n7, n8) / 8);
    return myMean;
}
//collision check
function colCheck(x, y) {
    if (featureMap[Math.floor(x + 0.5)][Math.floor(y + 0.5)] == 2 ||
        featureMap[Math.floor(x + 0.5)][Math.floor(y + 0.5)] == 3) {
        /* return true if the intended destination is inside a tile with 
        an obsticle */
        return true;
    }
}
//check if player is moving
function checkIfMoving() {
    if (keyPressed == 1 || buttonPressed == 1) {
        isMoving = 1;
    } else isMoving = 0;
}
//move player based on user input
function playerMove(player, eventKey) {
    if (leftKey || leftButton) {
        moving.left = 1;
        moveLeft();
    } else moving.left = 0;
    if (rightKey || rightButton) {
        moving.right = 1;
        moveRight();
    } else moving.right = 0;
    if (upKey || upButton) {
        moving.up = 1;
        moveUp();
    } else moving.up = 0;
    if (downKey || downButton) {
        moving.down = 1;
        moveDown();
    } else moving.down = 0;
    if (!downKey && !upKey && !leftKey && !rightKey) keyPressed = 0;
}
//player movement functions
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
//dig for treasure
function dig(x, y) {
    //determine the contents of the tile
    switch (featureMap[Math.round(x, 0)][Math.round(y, 0)]) {
        case 4: { //treasure tile
            featureMap[Math.round(x, 0)][Math.round(y, 0)] = 5;
            //remove treasure from treasurelist
            let rightTreasure = ""; //find the right object in treasureList
            for (let i = 0; i < treasureList.length; i++) {
                if (treasureList[i].x == Math.round(x, 0) &&
                    treasureList[i].y == Math.round(y, 0)) {
                    rightTreasure = i; //store index
                }
            }
            treasureList.splice(rightTreasure, 1); //remove it from list
            treasureFound++; //increment score
            //make prize icons visible
            let p1 = document.getElementById("prize-1");
            let p2 = document.getElementById("prize-2");
            let p3 = document.getElementById("prize-3");
            if (treasureFound == 1) p1.style.visibility = "visible";
            if (treasureFound == 2) p2.style.visibility = "visible";
            if (treasureFound == 3) p3.style.visibility = "visible";
            digLog++;
            break;
        }
        case 0: {//empty tile
            featureMap[Math.round(x, 0)][Math.round(y, 0)] = 5; //mark as dug
            digLog++;
            break;
        }
        case 5: {//previously dug up tile
            break;
        }
        case 1: //trees
        case 2: //rocks
        case 3: { //water
            break;
        }
    }
    if (treasureFound == 3) winCondition();
}
//check distance to nearest treasure
function checkHint() {
    //find closest treasure
    let dist = "";
    let shortestDist = 999999;
    //go through each treasure in list and record shortest distance
    for (let i = 0; i < treasureList.length; i++) {
        dist = myGetDistance(player.playerX,
            player.playerY,
            treasureList[i].x,
            treasureList[i].y);
        if (dist < shortestDist) {
            shortestDist = dist; //record new shortest distance
            nearestTreasure = treasureList[i].id;
        }
    }
    /*set the hint message using the distance to nearest treasure as the index 
    for the hint message and colour arrays*/
    if (Math.floor(shortestDist / 2) <= hints.length - 1) {
        hintMessage.innerHTML = hints[Math.floor(shortestDist / 2)];
        hintMessage.parentNode.style.backgroundColor =
            hintColors[Math.floor(shortestDist / 2)];
    } else {
        /*if the shortest distance is longer than the array length, use the 
        last entry in the array */
        hintMessage.innerHTML = hints[hints.length - 1];
        hintMessage.parentNode.style.backgroundColor =
            hintColors[hintColors.length - 1];
    }
}

//drawing functions
// update the position of the player in the player draw object
function updatePlayerDrawObject() {
    playerDrawObject.x = player.playerX;
    playerDrawObject.y = player.playerY;
    updatePlayerDrawAnimation();
}
//set animation
function updatePlayerDrawAnimation() {
    if (moving.up) player.animation = 1;
    if (moving.right) player.animation = 3;
    if (moving.down) player.animation = 5;
    if (moving.left) player.animation = 7;
    if (moving.left && moving.up) player.animation = 0;
    if (moving.right && moving.up) player.animation = 2;
    if (moving.right && moving.down) player.animation = 4;
    if (moving.left && moving.down) player.animation = 6;
}
//go through drawlist
function drawImages() {
    for (let i = 0; i < drawList.length; i++) {
        if (drawList[i].type == imgPlayer) {
            //function for drawing the player with animations
            drawPlayer(drawList[i].type,
                drawList[i].x,
                drawList[i].y,
                drawList[i].xo,
                drawList[i].yo,
                player.animation, 1);
        } else {
            //function for drawing non animated objects
            drawThis(drawList[i].type,
                drawList[i].x,
                drawList[i].y,
                drawList[i].xo,
                drawList[i].yo,
                drawList[i].va,
                drawList[i].wid,
                drawList[i].hei);
        }
    }
    //draw transparent player overlay
    drawPlayer(imgPlayer, player.playerX, player.playerY,
        player.playerOx, player.playerOy, player.animation, 0.2);
}
//sort images in drawlist by isometric y
function sortImages() {
    drawList.sort(function (a, b) {
        return getIsoY(a.x, a.y, tileWidth, tileHeight) -
            getIsoY(b.x, b.y, tileWidth, tileHeight);
    });
}
//draw an image
function drawThis(imageToDraw, x, y, originX, originY, va, wid, hei) {
    let drawX = getIsoX(x, y, tileWidth, tileHeight) + xScreenOffset - originX;
    let drawY = getIsoY(x, y, tileWidth, tileHeight) + yScreenOffset - originY +
        (tileHeight);
    ctx.globalAlpha = 1;
    ctx.drawImage(imageToDraw, va * wid, 0, wid, hei, drawX, drawY, wid, hei);
}
//draw the player
function drawPlayer(imageToDraw, x, y, originX, originY, animation, opacity) {
    let drawX = getIsoX(x, y, tileWidth, tileHeight) + xScreenOffset - originX;
    let drawY = getIsoY(x, y, tileWidth, tileHeight) + yScreenOffset - originY +
        (tileHeight);
    ctx.globalAlpha = opacity;
    ctx.drawImage(imageToDraw, Math.floor(playerAnimateCount) * 64,
        (player.animation + (isMoving * 8)) * 64, 64, 64, drawX, drawY, 64, 64);
    //animating from a single image from freeCodeCamp youtube tutorial
}
//draw the terain
function drawTerrain() {
    let heightOffSet = "";
    let heightOffSetNextX = "";
    let heightOffSetNextXY = "";
    let heightOffSetNextY = "";
    for (let n = 2; n < rows - 1; n++) {
        for (let m = 2; m < columns - 1; m++) {
            heightOffSet = heightMap[n][m]; //record height of current tile
            heightOffSetNextX = heightMap[n + 1][m]; //tile to southwest
            heightOffSetNextXY = heightMap[n + 1][m + 1]; //tile to south
            heightOffSetNextY = heightMap[n][m + 1]; //tile to southeast
            if (featureMap[n][m] == 3) {
                //set the draw colour for water tiles
                ctx.fillStyle = "#3CC3DB";
            } else {
                //use randomly generated values to add variation to tile shades
                ctx.fillStyle = smoothMap[n][m];
            }
            //draw the tile
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.moveTo(getIsoX(n, m, tileWidth, tileHeight) + xScreenOffset,
                getIsoY(n, m, tileWidth, tileHeight) - heightOffSet +
                yScreenOffset);
            ctx.lineTo(getIsoX(n + 1, m, tileWidth, tileHeight) + xScreenOffset,
                getIsoY(n + 1, m, tileWidth, tileHeight) - heightOffSetNextX +
                yScreenOffset);
            ctx.lineTo(getIsoX(n + 1, m + 1, tileWidth, tileHeight) +
                xScreenOffset, getIsoY(n + 1, m + 1, tileWidth, tileHeight) -
                heightOffSetNextXY + yScreenOffset);
            ctx.lineTo(getIsoX(n, m + 1, tileWidth, tileHeight) + xScreenOffset,
                getIsoY(n, m + 1, tileWidth, tileHeight) - heightOffSetNextY +
                yScreenOffset);
            ctx.fill();

            //draw tile outline
            ctx.strokeStyle = "#113715";
            ctx.beginPath();
            ctx.moveTo(getIsoX(n, m, tileWidth, tileHeight) + xScreenOffset,
                getIsoY(n, m, tileWidth, tileHeight) - heightOffSet +
                yScreenOffset);
            ctx.lineTo(getIsoX(n + 1, m, tileWidth, tileHeight) + xScreenOffset,
                getIsoY(n + 1, m, tileWidth, tileHeight) - heightOffSetNextX +
                yScreenOffset);
            ctx.lineTo(getIsoX(n + 1, m + 1, tileWidth, tileHeight) +
                xScreenOffset, getIsoY(n + 1, m + 1, tileWidth, tileHeight) -
                heightOffSetNextXY + yScreenOffset);
            ctx.stroke();
            if (featureMap[n][m] == 5) {
                /*draw a dug up hole as part of the terrain to prevent it being
                shown in front of the player*/
                drawThis(imgHole, n, m, 25, 25, 0, 50, 50);
            }
        }
    }
}
//clears the canvas ready for next frame
function clearCanvas() {
    ctx.clearRect(0, 0, CanvasWidth, CanvasHeight);
}
//draws a water backdrop
function drawBackground() {
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#3CC3DB";
    ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);
}
//win message
function winCondition() {
    let winMessage = document.getElementById("win-message");
    let timer = Math.round(gameTimer / 25, 2);
    winMessage.children[3].textContent = timer.toString() + " seconds to dig " +
        digLog.toString() + " holes!";
    winMessage.style.zIndex = 4;
    winMessage.style.visibility = "visible";
    gameState = 0;
}
//main game loop
let gameTimer = 0;
function gameLoop() {
    clearCanvas();
    if (gameState) {
        playerMove(player);
        checkIfMoving();
    }
    checkHint();
    drawBackground();
    drawTerrain();
    updatePlayerDrawObject();
    playerAnimateCount += 0.5;
    if (playerAnimateCount > 7) playerAnimateCount = 0;
    sortImages();
    drawImages();
    gameTimer++; //record the duration of the game
}

//draw everything once before starting the game to give a backdrop
clearCanvas();
drawBackground();
drawTerrain();
updatePlayerDrawObject();
drawImages();

//event listeners
//key downs
document.addEventListener('keydown', (event) => {
    if (event.key == "ArrowLeft") leftKey = 1;
    if (event.key == "ArrowRight") rightKey = 1;
    if (event.key == "ArrowUp") upKey = 1;
    if (event.key == "ArrowDown") downKey = 1;
    keyPressed = 1;
});
document.addEventListener('keyup', (event) => {
    //key up
    if (event.key == "ArrowLeft") leftKey = 0;
    if (event.key == "ArrowRight") rightKey = 0;
    if (event.key == "ArrowUp") upKey = 0;
    if (event.key == "ArrowDown") downKey = 0;
    if (event.key == " ") {
        dig(player.playerX, player.playerY);
        spaceKey = 0; /* only listen for space bar key up as constant input is 
        not required*/
    }
});

//button event listeners
document.addEventListener("DOMContentLoaded", function () {
    let upButton2 = document.getElementById('up-button');
    let downButton2 = document.getElementById('down-button');
    let leftButton2 = document.getElementById('left-button');
    let rightButton2 = document.getElementById('right-button');
    let upLeftButton2 = document.getElementById('up-left-button');
    let upRightButton2 = document.getElementById('up-right-button');
    let downLeftButton2 = document.getElementById('down-left-button');
    let downRightButton2 = document.getElementById('down-right-button');
    //button pressed
    upButton2.addEventListener("pointerdown", function () {
        upButton = 1; //move up
        buttonPressed = 1;
    });
    downButton2.addEventListener("pointerdown", function () {
        downButton = 1; //move down
        buttonPressed = 1;
    });
    leftButton2.addEventListener("pointerdown", function () {
        leftButton = 1; //move left
        buttonPressed = 1;
    });
    rightButton2.addEventListener("pointerdown", function () {
        rightButton = 1; //move right
        buttonPressed = 1;
    });
    upLeftButton2.addEventListener("pointerdown", function () {
        upButton = 1; //move up and left
        leftButton = 1;
        buttonPressed = 1;
    });
    upRightButton2.addEventListener("pointerdown", function () {
        upButton = 1; //move up and right
        rightButton = 1;
        buttonPressed = 1;
    });
    downLeftButton2.addEventListener("pointerdown", function () {
        leftButton = 1; //move down and left
        downButton = 1;
        buttonPressed = 1;
    });
    downRightButton2.addEventListener("pointerdown", function () {
        rightButton = 1; //move down and right
        downButton = 1;
        buttonPressed = 1;
    });
    //pointer released
    upButton2.addEventListener("pointerup", function () {
        upButton = 0;
        buttonPressed = 0;
    });
    downButton2.addEventListener("pointerup", function () {
        downButton = 0;
        buttonPressed = 0;
    });
    leftButton2.addEventListener("pointerup", function () {
        leftButton = 0;
        buttonPressed = 0;
    });
    rightButton2.addEventListener("pointerup", function () {
        rightButton = 0;
        buttonPressed = 0;
    });
    upLeftButton2.addEventListener("pointerup", function () {
        upButton = 0;
        leftButton = 0;
        buttonPressed = 0;
    });
    upRightButton2.addEventListener("pointerup", function () {
        upButton = 0;
        rightButton = 0;
        buttonPressed = 0;
    });
    downLeftButton2.addEventListener("pointerup", function () {
        leftButton = 0;
        downButton = 0;
        buttonPressed = 0;
    });
    downRightButton2.addEventListener("pointerup", function () {
        rightButton = 0;
        downButton = 0;
        buttonPressed = 0;
    });
    //pointer leaves button
    upButton2.addEventListener("pointerleave", function () {
        upButton = 0;
        buttonPressed = 0;
    });
    downButton2.addEventListener("pointerleave", function () {
        downButton = 0;
        buttonPressed = 0;
    });
    leftButton2.addEventListener("pointerleave", function () {
        leftButton = 0;
        buttonPressed = 0;
    });
    rightButton2.addEventListener("pointerleave", function () {
        rightButton = 0;
        buttonPressed = 0;
    });
    upLeftButton2.addEventListener("pointerleave", function () {
        upButton = 0;
        leftButton = 0;
        buttonPressed = 0;
    });
    upRightButton2.addEventListener("pointerleave", function () {
        upButton = 0;
        rightButton = 0;
        buttonPressed = 0;
    });
    downLeftButton2.addEventListener("pointerleave", function () {
        leftButton = 0;
        downButton = 0;
        buttonPressed = 0;
    });
    downRightButton2.addEventListener("pointerleave", function () {
        rightButton = 0;
        downButton = 0;
        buttonPressed = 0;
    });
    let resetButton = document.getElementById('reset-button');
    resetButton.addEventListener("click", function () {
        //reload the page
        window.location.reload();
        return false;
    });
    let resetButton2 = document.getElementById('reset-button-2');
    resetButton2.addEventListener("click", function () {
        //reload the page
        window.location.reload();
        return false;
    });
    let digButton = document.getElementById('dig-button');
    digButton.addEventListener("click", function () {
        //dig
        dig(player.playerX, player.playerY);
    });
    let startButton = document.getElementById('start-button');
    startButton.addEventListener("click", function () {
        /*start the game once we've determined it has not already started */
        if (!started) {
            let startMessage = document.getElementById('start-message');
            startMessage.style.visibility = "hidden";
            started = true;
            gameState = 1;
            setInterval(gameLoop, 40);
        }
    });
});