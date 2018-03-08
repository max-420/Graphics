function Projection() {
    this.points3D = [];
    this.projectionXY = [];
    this.projectionXZ = [];
    this.projectionYZ = [];
    this.bindingTolerance = 10;
    this.addPoint = function (point) {
        var projectionPoint = this.get3DPoint(point);
        var nearestPoint = this.getNearestPoint(projectionPoint);
        if (nearestPoint == null) {
            this.points3D.push(projectionPoint);
            return;
        }
        var mergedPoint = this.mergePoints(projectionPoint, nearestPoint);
        this.points3D.splice(this.points3D.indexOf(nearestPoint), 1, mergedPoint);
    }
    this.mergePoints = function(from, to)
    {
        var result = {};
        if (to.x == 0) {
            result.x = from.x;
            result.y = to.y;
            result.z = to.z;
        }
        if (to.y == 0) {
            result.x = to.x;
            result.y = from.y;
            result.z = to.z;

        }
        if (to.z == 0) {
            result.x = to.x;
            result.y = to.y;
            result.z = from.z;
        }
        return result;
    }

    this.get3DPoint = function (point) {
        if (point.x < 0 && point.y < 0) {
            return (
                {
                    x: -point.x,
                    y: 0,
                    z: -point.y
                });
        }
        if (point.x < 0 && point.y > 0) {
            return (
                {
                    x: -point.x,
                    y: point.y,
                    z: 0,
                });
        }
        if (point.x > 0 && point.y < 0) {
            return (
                {
                    x: 0,
                    y: point.x,
                    z: -point.y
                });
        }
        return null;
    };

    this.getProjections = function () {
        return this.points3D.map(this.getProjection);
    };

    this.getProjection = function (point) {
        return (
            {
                xy: point.x !== 0 && point.y !== 0 ? new Point(-point.x, point.y) : null,
                xz: point.x !== 0 && point.z !== 0 ? new Point(-point.x, -point.z) : null,
                yz: point.y !== 0 && point.z !== 0 ? new Point(point.y, -point.z) : null,
            }
        );

    };

    this.getNearestPoint = function (projectionPoint) {
        var tolerance = this.bindingTolerance;
        if (projectionPoint.x == 0) {
            for (var i = 0; i < this.points3D.length; i++) {
                if ((this.points3D[i].z == 0 && this.points3D[i].y >= projectionPoint.y - tolerance && this.points3D[i].y <= projectionPoint.y + tolerance)
                    || (this.points3D[i].y == 0 && this.points3D[i].z >= projectionPoint.z - tolerance && this.points3D[i].z <= projectionPoint.z + tolerance)) {
                    return this.points3D[i];
                }
            }
        }
        if (projectionPoint.y == 0) {
            for (var i = 0; i < this.points3D.length; i++) {
                if ((this.points3D[i].z == 0 && this.points3D[i].x >= projectionPoint.x - tolerance && this.points3D[i].x <= projectionPoint.x + tolerance)
                    || (this.points3D[i].x == 0 && this.points3D[i].z >= projectionPoint.z - tolerance && this.points3D[i].z <= projectionPoint.z + tolerance)) {
                    return this.points3D[i];
                }
            }

        }
        if (projectionPoint.z == 0) {
            for (var i = 0; i < this.points3D.length; i++) {
                if ((this.points3D[i].x == 0 && this.points3D[i].y >= projectionPoint.y - tolerance && this.points3D[i].y <= projectionPoint.y + tolerance)
                    || (this.points3D[i].y == 0 && this.points3D[i].x >= projectionPoint.x - tolerance && this.points3D[i].x <= projectionPoint.x + tolerance)) {
                    return this.points3D[i];
                }
            }
        }
        return null;
    }
    this.bind = function (point) {
        var point3D = this.get3DPoint(point);
        var nearest = this.getNearestPoint(point3D);
        if (nearest != null) {
            var merged = this.mergePoints(nearest, point3D);
            return this.getProjection(merged);
        }
        return null;
    };
    this.validate = function (pointsCount) {
        return this.points3D.length == pointsCount &&
            this.points3D.every(function (p) {
                return p.x != 0 && p.y != 0 && p.z != 0;
            });
    };
}