function ProjectionManager(mediator, projectionPointsDrawer, stylesManager, projectionParams) {
    this.projections = [];
    this.graphics = [];
    this.text = null;
    this.testMode = false;
    this.tasks = [
        [
            new Projection('polygon', [{x:90,y:90,z:90}, {x:120,y:120,z:120}, {x:60,y:30,z:30}])
        ],
        [
            new Projection('polygon', [{x:90,y:90,z:90}, {x:120,y:120,z:120}, {x:60,y:30,z:30}])
        ],
        [
            new Projection('polygon', [{x:90,y:90,z:90}, {x:120,y:120,z:120}, {x:60,y:30,z:30}])
        ],
        [
            new Projection('polygon', [{x:90,y:90,z:90}, {x:120,y:120,z:120}, {x:60,y:30,z:30}])
        ],
        [
            new Projection('polygon', [{x:90,y:90,z:90}, {x:120,y:120,z:120}, {x:60,y:30,z:30}])
        ],
        [
            new Projection('polygon', [{x:90,y:90,z:90}, {x:120,y:120,z:120}, {x:60,y:30,z:30}])
        ],
        [
            new Projection('polygon', [{x:90,y:90,z:90}, {x:120,y:120,z:120}, {x:60,y:30,z:30}])
        ],
    ];

    function getPointText(point) {
        return '(' + point.x + ';' + point.y + ';' + point.z + ')';
    }

    this.getTasks = function () {
        return this.tasks.map(function (t) {
            return this.getTaskText(t);
        }.bind(this));
    };

    this.getTaskText = function (task) {
        var result = "";
        result += 'Построить ';
        if (task[0].shape == 'polygon') {
            if (task[0].points3D.length == 1) {
                result += 'точку ';
            }
            if (task[0].points3D.length == 2) {
                result += 'отрезок ';
            }
            if (task[0].points3D.length == 3) {
                result += 'многоугольник ';
            }
            result += 'с координатами ';
            task[0].points3D.forEach(function (p, i, arr) {
                result += getPointText(p);
                if (i != arr.length - 1) {
                    result += ','
                }
                result += ' ';
            });
        }
        return result;
    };

    this.validateTask = function (taskIndex) {
        var task = this.tasks[taskIndex];
        var errors = [];
        this.projections.forEach(function (p) {
            errors = errors.concat(p.validateTask(task[0]));
        });
        this.graphics.forEach(function (g) {
            g.remove();
        });
        this.redraw();
        return errors;
    };
    this.redraw = function () {
        projectionPointsDrawer.resetPointText();
        this.projections.forEach(function (shape, index) {
            var shapeGroup = new Group();
            var pointProjections = shape.getProjections();

            pointProjections.forEach(function (proj) {
                if (projectionParams.showLinkLines) {
                    shapeGroup.addChild(projectionPointsDrawer.drawLinkLines(proj));
                }
                shapeGroup.addChild(projectionPointsDrawer.drawProjectedPoint(proj));
            });
            if (projectionParams.showPointText) {
                shapeGroup.addChild(projectionPointsDrawer.drawPointText(pointProjections));
            }

            var shapeXY = this.drawShape(pointProjections.map(function (p) {
                return p.xy
            }).filter(function (item) {
                return item != null
            }), shape.shape);
            if (shapeXY) {
                shapeXY.data.projection = shape;
                shapeGroup.addChild(shapeXY);
            }

            var shapeYZ = this.drawShape(pointProjections.map(function (p) {
                return p.yz
            }).filter(function (item) {
                return item != null
            }), shape.shape);
            if (shapeYZ) {
                shapeYZ.data.projection = shape;
                shapeGroup.addChild(shapeYZ);
            }

            var shapeXZ = this.drawShape(pointProjections.map(function (p) {
                return p.xz
            }).filter(function (item) {
                return item != null
            }), shape.shape);
            if (shapeXZ) {
                shapeXZ.data.projection = shape;
                shapeGroup.addChild(shapeXZ);
            }
            this.graphics[index] = shapeGroup;
        }.bind(this));
        return this.graphics;
    };

    this.drawShape = function (points, shape) {
        if (points.length < 2) return;
        var shape;
        if (shape == 'ellipse') {
            shape = this.drawEllipse(points);
        }
        if (shape == 'polygon') {
            shape = this.drawPolygon(points);
        }
        if (shape) {
            stylesManager.applyStyle(shape, 'drawing');
            return shape;
        }
    };
    this.drawPolygon = function (points) {
        var shape = new Group();
        for (var i = 1; i < points.length; i++) {
            shape.addChild(new Path.Line(points[i - 1], points[i]));
        }
        if (points.length > 2) {
            shape.addChild(new Path.Line(points[0], points[points.length - 1]));
        }
        return shape;
    };
    this.drawEllipse = function (points) {
        if (points.length != 3) return;
        var shape = new Group();
        var point1 = points[0].multiply(2).subtract(points[1]);
        var point2 = points[0].multiply(2).subtract(points[2]);

        var diff1 = points[1].subtract(points[0]);
        var diff2 = points[2].subtract(points[0]);

        var angle = new Point(1, 0).getDirectedAngle(diff1);
        var r1 = points[0].getDistance(points[1]);
        var r2 = diff2.project(diff1).getDistance(diff2);

        var rect = new Rectangle(points[0].subtract([r1, r2]), points[0].add([r1, r2]));

        var radAngle = diff1.getDirectedAngle(diff2);
        console.log(radAngle);
        var skewAngle = Math.abs(radAngle) >= 90 ? -radAngle % 90 : 90 - radAngle % 90;
        var skewPoint = [skewAngle, 0];

        var ellipse = new Path.Ellipse(rect);
        ellipse.skew(skewPoint);
        ellipse.rotate(angle);
        shape.addChild(ellipse);

        var ellipse1 = new Path.Rectangle(rect);
        ellipse1.skew(skewPoint);
        ellipse1.rotate(angle);
        shape.addChild(ellipse1);

        return shape;
    }
}