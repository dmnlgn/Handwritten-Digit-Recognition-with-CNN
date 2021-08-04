ctx = canvas.getContext("2d");
var drawing = false;

canvas.setAttribute("width", "400");
canvas.setAttribute("height", "400");

const translatedX = (x) => {
    const rect = canvas.getBoundingClientRect();
    var factor = canvas.width / rect.width;
    return factor * (x - rect.left);
}

const translatedY = (y) => {
    const rect = canvas.getBoundingClientRect();
    var factor = canvas.width / rect.width;
    return factor * (y - rect.top);
}

const drawPoint = (e) => {
    ctx.lineWidth = 30;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";
    canvas.style.backgroundColor = "black";

    if (drawing) {
        ctx.lineTo(translatedX(e.x), translatedY(e.y));
        ctx.stroke();
        ctx.beginPath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(translatedX(e.x), translatedY(e.y));
    }
}

const startPos = (e) => {
    drawing = true;
    drawPoint(e);
}

const endPos = () => {
    drawing = false;
    ctx.beginPath();
}

const clearCanvas = (id) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener('mousedown', startPos);
canvas.addEventListener('mousemove', drawPoint);
canvas.addEventListener('mouseup', endPos);

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