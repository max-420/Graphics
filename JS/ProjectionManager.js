function ProjectionManager(mediator, projectionPointsDrawer, stylesManager, projectionParams) {
    this.projections = [];
    this.graphics = [];
    this.text = null;
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
            }));
            if(shapeXY)
            {
                shapeGroup.addChild(shapeXY);
            }

            var shapeYZ = this.drawShape(pointProjections.map(function (p) {
                return p.yz
            }).filter(function (item) {
                return item != null
            }));
            if(shapeYZ)
            {
                shapeGroup.addChild(shapeYZ);
            }

            var shapeXZ = this.drawShape(pointProjections.map(function (p) {
                return p.xz
            }).filter(function (item) {
                return item != null
            }));
            if(shapeXZ)
            {
                shapeGroup.addChild(shapeXZ);
            }
            this.graphics[index] = shapeGroup;
        }.bind(this));
        return this.graphics;
    };

    this.drawShape = function(points)
    {
        if (points.length < 2) return;
        var shape = new Group();
        for (var i = 1; i<points.length; i++)
        {
            shape.addChild(new Path.Line(points[i-1],points[i]));
        }
        if(points.length > 2)
        {
            shape.addChild(new Path.Line(points[0],points[points.length - 1]));
        }
        stylesManager.applyStyle(shape, 'drawing');
        return shape;
    };
}