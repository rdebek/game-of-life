var cellSize = 20;
var cellsInOneRow = Math.floor(600 / cellSize);
var cellsInOneColumn = Math.floor(1100 / cellSize);
var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext('2d');
var allowedCellSizes = [4, 5, 10, 20, 25, 50, 100];
var color = 'rgb';
var interval;
var timeout = 500;

var active_array = [];
var inactive_array = [];
var isPaused = false;
var cellShape = 'circle';


function initializeArr() {
    active_array.length = 0;
    for (let i = 0; i < cellsInOneRow; i++) {
        active_array[i] = [];
        for (let j = 0; j < cellsInOneColumn; j++) {
            active_array[i][j] = 0;
        }
    }
    copyArr(active_array, inactive_array);
}

function copyArr(copyFrom, copyTo) {
    copyTo.length = 0;
    for (var i = 0; i < copyFrom.length; i++)
        copyTo[i] = copyFrom[i].slice();
}


function randomArr() {
    for (i = 0; i < cellsInOneRow; i++) {
        for (j = 0; j < cellsInOneColumn; j++) {
            active_array[i][j] = (Math.random() > 0.5) ? 1 : 0;
        }
    }
}

function calculateNextState() {
    for (let i = 0; i < cellsInOneRow; i++) {
        for (let j = 0; j < cellsInOneColumn; j++) {
            inactive_array[i][j] = parseNeighbors(getNumberOfNeighbors(i, j), i, j);
        }
    }
    copyArr(inactive_array, active_array);
}

function getNumberOfNeighbors(i, j) {
    var neighbors = 0;

    neighbors += handleOutOfBounds(i + 1, j);
    neighbors += handleOutOfBounds(i - 1, j);
    neighbors += handleOutOfBounds(i, j + 1);
    neighbors += handleOutOfBounds(i, j - 1);
    neighbors += handleOutOfBounds(i - 1, j - 1);
    neighbors += handleOutOfBounds(i + 1, j + 1);
    neighbors += handleOutOfBounds(i + 1, j - 1);
    neighbors += handleOutOfBounds(i - 1, j + 1);

    return neighbors;
}

function parseNeighbors(neighbors, i, j) {
    if (neighbors == 3 && active_array[i][j] == 0) {
        return 1;
    }
    else if (neighbors > 3 || neighbors < 2) {
        return 0;
    }
    else {
        return active_array[i][j];
    }
}

function handleOutOfBounds(i, j) {
    if (i == -1 || j == -1) {
        return 0;
    }
    if (i >= active_array.length || j >= active_array[0].length) {
        return 0;
    }
    try {
        var p = active_array[i][j];
    } catch (error) {
        p = 0;
    }
    return p;
}

function displayState() {
    for (let i = 0; i < cellsInOneRow; i++) {
        for (let j = 0; j < cellsInOneColumn; j++) {
            unfillCell(i, j);
            if (active_array[i][j] == 1) {
                fillCell(i, j);
            }
        }
    }
}

function unfillCell(i, j) {
    ctx.fillStyle = `rgb(255, 255, 255)`;
    ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
    ctx.lineWidth = 0.5;
    ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
}


function fillCell(i, j) {
    if (color == 'rgb') {
        ctx.fillStyle = `rgb(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)})`;
    }
    else {
        ctx.fillStyle = `rgb(96, 40, 164)`;
    }
    switch (cellShape) {
        case 'circle': {
            ctx.beginPath();
            ctx.arc(j * cellSize + cellSize / 2, i * cellSize + cellSize / 2, cellSize / 2, 0, 2 * Math.PI);
            ctx.fill();
            break;
        }
        case 'rect': {
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            break;

        }
    }


}


function pause() {
    var btn = document.getElementById("pause");
    btn.classList.toggle("button-clicked");
    if (!isPaused) {
        isPaused = true;
    }
    else {
        isPaused = false;
    }
}

function changeShape() {
    var btn = document.getElementById("shape-button");
    var rgbButton = document.getElementById("rgb-button");
    var blackButton = document.getElementById("black-button");
    if (btn.checked) {
        cellShape = 'rect';
        rgbButton.classList.replace("circle-button", "square-button");
        blackButton.classList.replace("circle-button", "square-button");
    }
    else {
        cellShape = 'circle';
        rgbButton.classList.replace("square-button", "circle-button");
        blackButton.classList.replace("square-button", "circle-button");

    }
}

function changeColor() {
    var btn = document.getElementById("color-button");
    if (btn.checked) {
        color = 'other';
    }
    else {
        color = 'rgb';
    }
}



function startGame() {
    initListener();
    initializeArr();
    randomArr();
    interval = setInterval(refreshView, timeout);
}


function refreshView() {
    if (!isPaused) {
        displayState();
        calculateNextState();
    }
}

function initListener() {
    var canvasLeft = canvas.clientLeft + canvas.offsetLeft;
    var canvasTop = canvas.clientTop + canvas.offsetTop;
    canvas.addEventListener('click', function (event) {
        var x = event.pageX - canvasLeft;
        var y = event.pageY - canvasTop;
        i = Math.floor(y / cellSize);
        j = Math.floor(x / cellSize);
        if (active_array[i][j] == 0) {
            active_array[i][j] = 1;
            fillCell(i, j);
        }
        else {
            active_array[i][j] = 0;
            unfillCell(i, j);
        }
    })

}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


function handleBordersEdgeCases(slider) {
    if (slider.value == slider.max) {
        slider.style.borderRight = "none";
    }
    else if (slider.value == slider.min) {
        slider.style.borderLeft = "none";
    }
    else {
        slider.style.borderRight = "solid 3px black";
        slider.style.borderLeft = "solid 3px black";
    }
}


var windowSlider = document.getElementById("windowSize");
windowSlider.oninput = function () {
    handleBordersEdgeCases(windowSlider);
    cellSize = allowedCellSizes[this.value];
    cellsInOneRow = Math.floor(600 / cellSize);
    cellsInOneColumn = Math.floor(1100 / cellSize);
    initializeArr();
    randomArr();
}

var timeSlider = document.getElementById("timeInterval");
timeSlider.oninput = function () {
    handleBordersEdgeCases(timeSlider);
    timeout = -this.value;
    clearInterval(interval);
    interval = setInterval(refreshView, timeout);
}

