function Point(x, y) {
    this.x = x;
    this.y = y;

    Object.defineProperty(this, "x", {
        writable: false,
    });
    Object.defineProperty(this, "y", {
        writable: false,
    });


    this.difference = function (point) {
        return new Point(this.x - point.x, this.y - point.y);
    };
    this.sum = function (point) {
        return new Point(this.x + point.x, this.y + point.y);
    };

    this.divide = function (divisor) {
        return new Point(this.x / divisor, this.y / divisor);
    };

    this.multiply = function (multiplier) {
        return new Point(this.x * multiplier, this.y * multiplier);
    };

    this.round = function()
    {
        return new Point(Math.round(this.x), Math.round(this.y));
    }

    this.toString = function () {
        return x.toString() + ", " + y.toString();
    }
};