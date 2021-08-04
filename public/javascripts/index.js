ctx = canvas.getContext("2d");
var drawing = false;

canvas.setAttribute("width", "400");
canvas.setAttribute("height", "400");
canvas.style.backgroundColor = "black";

const translatedX = (x) => {
    const rect = canvas.getBoundingClientRect();
    var factor = canvas.width / rect.width;
    return factor * (x - rect.left);
};

const translatedY = (y) => {
    const rect = canvas.getBoundingClientRect();
    var factor = canvas.width / rect.width;
    return factor * (y - rect.top);
};

const drawPoint = (e) => {
    ctx.lineWidth = 30;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";

    if (drawing) {
        ctx.lineTo(translatedX(e.x), translatedY(e.y));
        ctx.stroke();
        ctx.beginPath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(translatedX(e.x), translatedY(e.y));
    }
};

const startPos = (e) => {
    drawing = true;
    drawPoint(e);
};

const endPos = () => {
    drawing = false;
    ctx.beginPath();
};

const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

canvas.addEventListener('mousedown', startPos);
canvas.addEventListener('mousemove', drawPoint);
canvas.addEventListener('mouseup', endPos);

// --- model status ---
document.addEventListener('DOMContentLoaded', async () => {
    model = await tf.loadLayersModel("http://localhost:3000/assets/model/model.json");
}, false);

const getImageFromCanvas = (image) => {
    let tensor = tf.browser.fromPixels(image)
    .resizeNearestNeighbor([28, 28])
    .mean(2)
    .expandDims(2)
    .expandDims()
    .toFloat()
    return tensor.div(255.0);
};

// --- predict and display ---
const predict = async () => {
    let tensor = getImageFromCanvas(canvas);
    let predictions = await model.predict(tensor).data();
    let results = Array.from(predictions);
    displayChart(results);
    displayLabel(results);
};

document.getElementById('chart_box').style.display = "none";

/* --- chart display prediction --- */
var chart = "";
var firstTime = 0;
const loadChart = (label, data, modelSelected) => {
    var ctx = document.getElementById('chart_box').getContext('2d');
    Chart.defaults.color = "#5c5c5c";
    Chart.defaults.borderColor	 = '#979797';
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: label,
            datasets: [{
                label: 'Predition ' + modelSelected,
                backgroundColor: 'rgb(255,129,0)',
                borderColor: 'rgb(196,98,0)',
                data: data,
                borderWidth: 2
            }]
        },
        options: {}
    })
};

// --- display chart with updated drawing from canvas ---
const displayChart = data => {
    var select_model  = document.getElementById("select_model");
    var select_option = "CNN";
    
    label = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    if (firstTime == 0) {
        loadChart(label, data, select_option);
        firstTime = 1;
    } else {
        chart.destroy();
        loadChart(label, data, select_option);
    }
    document.getElementById('chart_box').style.display = "block";
};

// --- dispplay label function ---
const displayLabel = data => {
    var max = data[0];
    var maxIndex = 0;

    for (var i = 1; i < data.length; i++) {
        if (data[i] > max) {
            maxIndex = i;
            max = data[i];
        }
    }
    $(".prediction-text").html("Predicting you draw <b>"+maxIndex+"</b> with <b>"+Math.trunc( max*100 )+"%</b> confidence");
};