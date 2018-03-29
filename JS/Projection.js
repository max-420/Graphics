function Projection(shape, points3D) {
    this.shape = shape;
    this.points3D = points3D ? points3D : [];
    this.bindingTolerance = 10;
    this.autoMerge = false;
    this.isNear = function(a, b)
    {
        return b >= a - this.bindingTolerance && b <= a + this.bindingTolerance;
    };
    this.addPoint = function (point) {
        var projectionPoint = this.get3DPoint(point);
        var nearestPoint = this.getNearestPoint(projectionPoint);
        if (nearestPoint == null || !this.autoMerge) {
            this.points3D.push(projectionPoint);
            return;
        }
        var mergedPoint = this.mergePoints(projectionPoint, nearestPoint);
        this.points3D.splice(this.points3D.indexOf(nearestPoint), 1, mergedPoint);
    }

    this.validateTask = function(task)
    {
        task.points3D.forEach(function(taskPoint)
        {
            var yz = this.points3D.find(function (point) {
                return point.x == 0 && this.isNear(point.y, taskPoint.y) && this.isNear(point.z, taskPoint.z);
            }.bind(this));
            var xz = this.points3D.find(function (point) {
                return point.y == 0 && this.isNear(point.x, taskPoint.x) && this.isNear(point.z, taskPoint.z);
            }.bind(this));
            var xy = this.points3D.find(function (point) {
                return point.z == 0 && this.isNear(point.x, taskPoint.x) && this.isNear(point.y, taskPoint.y);
            }.bind(this));
            if(xy && xz && yz)
            {
                this.points3D.splice(this.points3D.indexOf(xy), 1);
                this.points3D.splice(this.points3D.indexOf(xz), 1);
                this.points3D.splice(this.points3D.indexOf(yz), 1);
                this.points3D.push(taskPoint);
            }
            else
            {
                return false;
            }
        }.bind(this));
        return this.validate(task.points3D.length);
    }

    // this.remerge = function()
    // {
    //     var i = 0;
    //     while(true) {
    //         var point = this.points3D[i];
    //         if(!point) break;
    //         while(true)
    //         {
    //             var nearestPoint = this.getNearestPoint(point);
    //             if(!nearestPoint) break;
    //             if(nearestPoint.x != 0 && (nearestPoint.x == point.x || point.x == 0) &&
    //                 nearestPoint.y != 0 && (nearestPoint.y == point.y || point.y == 0) &&
    //                 nearestPoint.z != 0 && (nearestPoint.z == point.z || point.z == 0))
    //             {
    //                 this.points3D.splice(this.points3D.indexOf(point), 1);
    //                 i--;
    //                 break;
    //             }
    //             var mergedPoint = this.mergePoints(point, nearestPoint);
    //             this.points3D.splice(this.points3D.indexOf(point), 1, mergedPoint);
    //             this.points3D.splice(this.points3D.indexOf(nearestPoint), 1);
    //         }
    //         i++;
    //     }
    // }

    this.mergePoints = function(from, to)
    {
        var result = {};
        result.x = to.x;
        result.y = to.y;
        result.z = to.z;
        if (to.x == 0) {
            result.x = from.x;
        }
        if (to.y == 0) {
            result.y = from.y;
        }
        if (to.z == 0) {
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
        var e = this.points3D.length == pointsCount &&
            this.points3D.every(function (p) {
                return p.x != 0 && p.y != 0 && p.z != 0;
            });
        return e;
    };
}