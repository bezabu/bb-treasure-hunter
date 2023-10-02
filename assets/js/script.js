let canvas = document.getElementById("game-area");
let ctx = canvas.getContext("2d");
let CanvasWidth = canvas.width = 800;
let CanvasHeight = canvas.height = 450;

ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);
ctx.fillStyle = "#ffffff";
ctx.fillRect(CanvasWidth * 0.1, CanvasHeight * 0.1, CanvasWidth * 0.8, CanvasHeight * 0.8);
ctx.fillStyle = "#000000";
ctx.fillRect(CanvasWidth * 0.2, CanvasHeight * 0.2, CanvasWidth * 0.6, CanvasHeight * 0.6);