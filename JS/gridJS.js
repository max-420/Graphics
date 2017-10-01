var c = document.getElementById("grid");

c.width = window.innerWidth;
c.height = window.innerHeight;

var field = new DrawingField(c);


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
    var canvasRect = c.getBoundingClientRect();

    var mousePos = new Point(e.clientX - canvasRect.left, e.clientY - canvasRect.top);

    field.scale(Math.sign(delta), mousePos);
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

    field.move(newMousePos.difference(mousePos));

    mousePos = newMousePos;
});

addOnMouseUp(grid, function (e) {
    mouseDownOnGrid = false;
});