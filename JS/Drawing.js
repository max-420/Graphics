function Drawing() {

    this.shapes = [];

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
};