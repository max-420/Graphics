function Point(x, y) {
    this.X = x;
    this.Y = y;

    this.difference = function (point) {
        return new Point(this.X - point.X, this.Y - point.Y);
    };
    this.sum = function (point) {
        return new Point(this.X + point.X, this.Y + point.Y);
    };

    this.quotient = function (divisor) {
        return new Point(this.X / divisor, this.Y / divisor);
    };

    this.toString = function () {
        return X + ", " + Y;
    }
};