var c = document.getElementById("grid");
var ctx = c.getContext("2d");
var cellSize = 100;
var step = 5;
var zeroCoords;


function resizeCanvas() {
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    zeroCoords = new Point(c.width / 2, c.height / 2);

    drawGrid(zeroCoords, cellSize, c.width, c.height);
}
resizeCanvas();


function drawAxis(zeroCoords, cWidth) {
    ctx.beginPath();

    ctx.strokeStyle = 'red'; // меняем цвет рамки
    ctx.moveTo(0, zeroCoords.Y);
    ctx.lineTo(cWidth, zeroCoords.Y);
    ctx.moveTo(zeroCoords.X, 0);
    ctx.lineTo(zeroCoords.X, cWidth);
    ctx.lineWidth = 2; // толщина линии
    ctx.stroke();
}
//Рисует сетку
function drawGrid(zeroCoords, cellSize, cWidth, cHeight) {
    //Оси
    ctx.beginPath();

    ctx.strokeStyle = 'orange'; // меняем цвет рамки
    //Конец осей
    for (y = zeroCoords.Y; y > 0; y -= cellSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(cWidth, y);
    }

    for (y = zeroCoords.Y; y < cHeight; y += cellSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(cWidth, y);
    }

    for (x = zeroCoords.X; x > 0; x -= cellSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, cHeight)
    }

    for (x = zeroCoords.X; x < cWidth; x += cellSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, cHeight)
    }

    ctx.stroke();

    drawAxis(zeroCoords, cWidth);
}


//Маштабирование
function addOnWheel(elem, handler) {
    if (elem.addEventListener) {
        if ('onwheel' in document) {
            // IE9+, FF17+
            elem.addEventListener("wheel", handler);
        } else if ('onmousewheel' in document) {
            // устаревший вариант события
            elem.addEventListener("mousewheel", handler);
        } else {
            // 3.5 <= Firefox < 17, более старое событие DOMMouseScroll пропустим
            elem.addEventListener("MozMousePixelScroll", handler);
        }
    } else { // IE8-
        grid.attachEvent("onmousewheel", handler);
    }
}

addOnWheel(grid, function (e) {

    e.preventDefault();
    var delta = e.deltaY || e.detail || e.wheelDelta;

    if (cellSize - step < step && delta > 0) {
        return;
    }
    var canvasRect = c.getBoundingClientRect();

    mousePos = new Point(e.clientX - canvasRect.left, e.clientY - canvasRect.top);

    zeroCoords = zeroCoords.sum(mousePos.difference(zeroCoords).quotient(cellSize / step / Math.sign(delta)));

    cellSize -= step * Math.sign(delta);

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    drawGrid(zeroCoords, cellSize, c.width, c.height);
});

//Маштабирование конец
function addOnMouseDown(elem, handler) {

    if (elem.addEventListener) {
        elem.addEventListener("mousedown", handler);
    }
}
function addOnMouseUp(elem, handler) {

    if (elem.addEventListener) {
        elem.addEventListener("mouseup", handler);
    }
}
function addOnMouseMove(elem, handler) {

    if (elem.addEventListener) {
        elem.addEventListener("mousemove", handler);
    }
}
var mouseDownOnGrid = false;
var mousePos;

addOnMouseDown(grid, function (e) {
    mouseDownOnGrid = true;

    var canvasRect = c.getBoundingClientRect();

    mousePos = new Point(e.clientX - canvasRect.left, e.clientY - canvasRect.top);
});
addOnMouseMove(grid, function (e) {
    if (mouseDownOnGrid == false) return;
    var canvasRect = c.getBoundingClientRect();

    newMousePos = new Point(e.clientX - canvasRect.left, e.clientY - canvasRect.top);

    zeroCoords = zeroCoords.sum(newMousePos.difference(mousePos));

    mousePos = newMousePos;

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    drawGrid(zeroCoords, cellSize, c.width, c.height);
});
addOnMouseUp(grid, function (e) {
    mouseDownOnGrid = false;
});