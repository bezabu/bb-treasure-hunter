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
        featureMap[i][j] = j;
    }
}