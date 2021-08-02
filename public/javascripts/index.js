const canvasWidth = 400;
const canvasHeight = 400;
const canvasStrokeStyle = "white";
const canvasLineJoin = "round";
const canvasLineWidth = 30;
const canvasBackgroundColor = "black";
const canvasId = "canvas";

var clickX = [];
var clickY = [];
var clickD = [];
var drawing;

const canvasBox = document.getElementById("canvas-div");
const canvas = document.createElement("canvas");

canvas.setAttribute("width", canvasWidth);
canvas.setAttribute("height", canvasHeight);
canvas.setAttribute("id", canvasId);
canvas.style.backgroundColor = canvasBackgroundColor;
canvasBox.appendChild(canvas);

ctx = canvas.getContext("2d");

// --- mouse down function ---
$("#canvas").mousedown(function (e) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

    drawing = true;
    addUserGesture(mouseX, mouseY);
    drawnOnCanvas();
});

// --- mouse move function ---
$("#canvas").mousemove(function (e) {
    if (drawing) {
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;

        addUserGesture(mouseX, mouseY, true);
        drawnOnCanvas();
    }
});

// --- mouse up function ---
$("#canvas").mouseup(function (e) {
    drawing = false;
});

// --- mouse leave function ---
$("#canvas").mouseleave(function (e) {
    drawing = false;
});

// --- mouse click function ---
const addUserGesture = (x, y, dragging) => {
    clickX.push(x);
    clickY.push(y);
    clickD.push(dragging);
};

// --- re draw function ---
const drawnOnCanvas = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    ctx.strokeStyle = canvasStrokeStyle;
    ctx.lineJoin = canvasLineJoin;
    ctx.lineWidth = canvasLineWidth;

    for (let i = 0; i < clickX.length; i++) {
        ctx.beginPath();

        if (clickD[i] && i) {
            ctx.moveTo(clickX[i - 1], clickY[i - 1]);
        } else {
            ctx.moveTo(clickX[i] - 1, clickY[i]);
        }
        ctx.lineTo(clickX[i], clickY[i]);
        ctx.closePath();
        ctx.stroke();
    }
};

// --- clear canvas ---
const clearCanvas = id => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    clickX = [];
    clickY = [];
    clickD = [];
};

// --- model status ---
document.addEventListener('DOMContentLoaded', async () => {
    await loadModel();
}, false);

const loadModel = async () => {
    model = await tf.loadLayersModel("http://localhost:3000/assets/model/model.json");
};

const getImageFromCanvas = image => {
    let tensor = tf.browser.fromPixel(image)
    .resizeNearestNeighbor([28, 28])
    .mean(2)
    .expandDims(2)
    .expandDims()
    .toFloat()
    return tensor.div(255.0);
};