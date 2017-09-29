
var c = document.getElementById("grid");
var ctx = c.getContext("2d");
var cellSize = 100;
var step = 5;
var coordX;
var coordY;

// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);
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
var scale = 1;

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
    coordX += (mouseX - coordX)/cellSize*5*Math.sign(delta);
    coordY += (mouseY - coordY)/cellSize*5*Math.sign(delta);

    cellSize-=step*Math.sign(delta);

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    drawGrid(coordX,coordY,cellSize,c.width,c.height);
});

//Маштабирование конец

















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
    var scale = 1;

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
		coordX += (mouseX - coordX)/cellSize*5*Math.sign(delta);
		coordY += (mouseY - coordY)/cellSize*5*Math.sign(delta);
		
		cellSize-=step*Math.sign(delta);
		
		c.width = window.innerWidth;
		c.height = window.innerHeight;



		drawGrid(coordX,coordY,cellSize,c.width,c.height); 
    });
    
//Маштабирование конец