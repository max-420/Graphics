function Scaling(mediator, scalingSettings, canvas)
{
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

    addOnWheel(canvas, function (e) {
        var coef = scalingSettings.step;
        e.preventDefault();
        var delta = e.deltaY || e.detail || e.wheelDelta;
        var canvasRect = canvas.getBoundingClientRect();
        var mousePos = new Point(e.clientX - canvasRect.left, e.clientY - canvasRect.top);
        view.scale(1 - (coef * Math.sign(delta)), view.viewToProject(mousePos));
        mediator.publish("fieldScaled");
    });
}