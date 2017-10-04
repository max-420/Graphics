function DrawingField(canvas) {

    var canvas = canvas;
    var ctx = canvas.getContext("2d");

    this.gridStep = 10;
    this.scaleValue = 10;
    this.scaleStep = 0.1;
    this.zeroCoords = new Point(canvas.width / 2, canvas.height / 2);

    var convertToCanvasCoords = function(coords) {
        return coords.multiply(this.scaleValue).sum(this.zeroCoords).round();
    }.bind(this);

    var getCellSize = function () {
        return Math.round(this.gridStep * this.scaleValue);
    }.bind(this);

    this.scale = function (direction, center) {
        var minCellSize = 5;
        if (this.gridStep * this.scaleValue - this.scaleStep * direction < minCellSize) return;

        var zeroCoordsScaleCoef = this.scaleStep / this.scaleValue / direction;

        this.zeroCoords = this.zeroCoords.sum(center.difference(field.zeroCoords)
            .multiply(zeroCoordsScaleCoef)).round();

        this.scaleValue -= this.scaleStep * direction;

        redraw();
    };

    this.move = function (shift) {

        this.zeroCoords = this.zeroCoords.sum(shift);
        redraw();
    };

    var drawAxis = function () {
        ctx.beginPath();
        ctx.strokeStyle = 'red'; // меняем цвет рамки
        ctx.moveTo(0, this.zeroCoords.y);
        ctx.lineTo(canvas.width, this.zeroCoords.y);
        ctx.moveTo(this.zeroCoords.x, 0);
        ctx.lineTo(this.zeroCoords.x, canvas.width);
        ctx.lineWidth = 2; // толщина линии
        ctx.stroke();
    }.bind(this);

    var drawGrid = function () {

        var cellSize = getCellSize();
        ctx.beginPath();

        ctx.strokeStyle = 'orange'; // меняем цвет рамки
        //Конец осей
        for (y = this.zeroCoords.y; y > 0; y -= cellSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }

        for (y = this.zeroCoords.y; y < canvas.height; y += cellSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }

        for (x = this.zeroCoords.x; x > 0; x -= cellSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height)
        }

        for (x = this.zeroCoords.x; x < canvas.width; x += cellSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height)
        }

        ctx.stroke();
    }.bind(this);

    var redraw = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        drawAxis();
    }.bind(this);

    redraw();
};