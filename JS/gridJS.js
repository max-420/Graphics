
var c = document.getElementById("grid");
var ctx = c.getContext("2d");
var cellSize = 100;
var step = 5;
var coordX;
var coordY;


function resizeCanvas() {
    c.width = window.innerWidth;
    c.height = window.innerHeight;


    coordX = c.width / 2;
    coordY = c.height / 2;
    drawGrid(coordX,coordY,cellSize,c.width,c.height);
}
resizeCanvas();


function drawAxis(coordX, coordY, cWidth){
    ctx.beginPath();

    ctx.strokeStyle = 'red'; // меняем цвет рамки
    ctx.moveTo(0,coordY);
    ctx.lineTo(cWidth, coordY);
    ctx.moveTo(coordX,0);
    ctx.lineTo(coordX,cWidth);
    ctx.lineWidth = 2; // толщина линии
    ctx.stroke();
}
//Рисует сетку
function drawGrid(coordX,coordY,cellSize, cWidth, cHeight) {
    //Оси


    ctx.beginPath();

    ctx.strokeStyle = 'orange'; // меняем цвет рамки
    //Конец осей
    for(y = coordY; y > 0; y -= cellSize){
        ctx.moveTo(0,y);
        ctx.lineTo(cWidth, y);
    }

    for(y = coordY; y < cHeight; y += cellSize){
        ctx.moveTo(0,y);
        ctx.lineTo(cWidth, y);
    }

    for(x = coordX; x>0; x-=cellSize){
        ctx.moveTo(x,0);
        ctx.lineTo(x, cHeight)
    }

    for(x = coordX; x <cWidth; x +=cellSize){
        ctx.moveTo(x,0);
        ctx.lineTo(x, cHeight)
    }

    ctx.stroke();

    drawAxis(coordX, coordY, cWidth);
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

addOnWheel(grid, function(e) {

    e.preventDefault();
    var delta = e.deltaY || e.detail || e.wheelDelta;

    if(cellSize-step<step && delta>0)
    {
        return;
    }
    var canvasRect=c.getBoundingClientRect();
    var mouseX = e.clientX - canvasRect.left;
    var mouseY = e.clientY - canvasRect.top;
    coordX += (mouseX - coordX)/cellSize*step*Math.sign(delta);
    coordY += (mouseY - coordY)/cellSize*step*Math.sign(delta);

    cellSize-=step*Math.sign(delta);

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    drawGrid(coordX,coordY,cellSize,c.width,c.height);
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
var mouseX;
var mouseY;

addOnMouseDown(grid, function(e) {
    mouseDownOnGrid = true;

    var canvasRect=c.getBoundingClientRect();

    mouseX = e.clientX - canvasRect.left;
    mouseY = e.clientY - canvasRect.top;
});
addOnMouseMove(grid, function(e) {
    if(mouseDownOnGrid == false) return;
    var canvasRect=c.getBoundingClientRect();

    var newMouseX = e.clientX - canvasRect.left;
    var newMouseY = e.clientY - canvasRect.top;

    coordX -= (mouseX - newMouseX);
    coordY -= (mouseY - newMouseY);

    mouseX = newMouseX;
    mouseY = newMouseY;

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    drawGrid(coordX,coordY,cellSize,c.width,c.height);
});
addOnMouseUp(grid, function(e) {
    mouseDownOnGrid = false;
});