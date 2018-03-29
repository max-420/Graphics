function ProjectionManager(mediator, projectionPointsDrawer, stylesManager, projectionParams) {
    this.projections = [];
    this.graphics = [];
    this.text = null;
    this.validateTask = function(task)
    {
        var res = this.projections.every(function (p) {
            return p.validateTask(task);
        });
        this.graphics.forEach(function (g) {
            g.remove;
        });
        this.redraw();
        return res;
    }
    this.redraw = function()
    {
        projectionPointsDrawer.resetPointText();
        this.projections.forEach(function (shape, index) {
            var shapeGroup = new Group();
            var pointProjections = shape.getProjections();

            pointProjections.forEach(function (proj) {
                if(projectionParams.showLinkLines) {
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
            if(shapeXY)
            {
                shapeXY.data.projection = shape;
                shapeGroup.addChild(shapeXY);
            }

            var shapeYZ = this.drawShape(pointProjections.map(function (p) {
                return p.yz
            }).filter(function (item) {
                return item != null
            }), shape.shape);
            if(shapeYZ)
            {
                shapeYZ.data.projection = shape;
                shapeGroup.addChild(shapeYZ);
            }

            var shapeXZ = this.drawShape(pointProjections.map(function (p) {
                return p.xz
            }).filter(function (item) {
                return item != null
            }), shape.shape);
            if(shapeXZ)
            {
                shapeXZ.data.projection = shape;
                shapeGroup.addChild(shapeXZ);
            }
            this.graphics[index] = shapeGroup;
        }.bind(this));
        return this.graphics;
    };

    this.drawShape = function(points, shape)
    {
        if (points.length < 2) return;
        var shape;
        if(shape == 'ellipse')
        {
            shape = this.drawEllipse(points);
        }
        if(shape == 'polygon')
        {
            shape = this.drawPolygon(points);
        }
        if(shape) {
            stylesManager.applyStyle(shape, 'drawing');
            return shape;
        }
    };
    this.drawPolygon = function (points)
    {
        var shape = new Group();
        for (var i = 1; i<points.length; i++)
        {
            shape.addChild(new Path.Line(points[i-1],points[i]));
        }
        if(points.length > 2)
        {
            shape.addChild(new Path.Line(points[0],points[points.length - 1]));
        }
        return shape;
    };
    this.drawEllipse = function (points) {
        if(points.length != 3) return;
        var shape = new Group();
        var point1 = points[0].multiply(2).subtract(points[1]);
        var point2 = points[0].multiply(2).subtract(points[2]);

        var diff1 = points[1].subtract(points[0]);
        var diff2 = points[2].subtract(points[0]);

        var angle = new Point(1,0).getDirectedAngle(diff1);
        var r1 = points[0].getDistance(points[1]);
        var r2 = diff2.project(diff1).getDistance(diff2);

        var rect = new Rectangle(points[0].subtract([r1,r2]), points[0].add([r1,r2]));

        var radAngle = diff1.getDirectedAngle(diff2);
        console.log(radAngle);
        var skewAngle = Math.abs(radAngle) >= 90 ? -radAngle%90 : 90-radAngle%90;
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