function ProjectionPointsDrawer(mediator, stylesManager) {
    this.pointChar;
    function drawLinkLine(point1, point2) {
        var lines = new Group();
        if ((point1.x < 0 && point1.y < 0) || (point2.x < 0 && point2.y < 0)) {
            lines.addChild(new Path(point1, point2));
        }
        else {
            var xpoint = point1.x > 0 ? point1 : point2;
            var ypoint = point1.y > 0 ? point1 : point2;
            lines.addChild(new Path(xpoint, [xpoint.x, 0]));
            lines.addChild(new Path(ypoint, [0, ypoint.y]));
            lines.addChild(new Path.Arc([xpoint.x, 0], [xpoint.x / Math.sqrt(2), ypoint.y / Math.sqrt(2)], [0, ypoint.y]));
        }
        stylesManager.applyStyle(lines, 'linkLine');
        return lines;
    }

    function drawPoint(point) {
        var icon = new Path.Circle(point, 5);
        stylesManager.applyStyle(icon, 'projectionPoint');
        return icon;
    }

    this.drawProjectedPoint = function (projectedPoint) {
        var pointsGroup = new Group();
        if (projectedPoint.xy != null) {
            pointsGroup.addChild(drawPoint(projectedPoint.xy));
        }
        if (projectedPoint.xz != null) {
            pointsGroup.addChild(drawPoint(projectedPoint.xz));
        }
        if (projectedPoint.yz != null) {
            pointsGroup.addChild(drawPoint(projectedPoint.yz));
        }
        return pointsGroup;
    }
    this.drawPointText = function(projectedPoint)
    {
        var offset = new Point(10, -10);
        var textGroup = new Group();
        if (projectedPoint.xy != null) {
            var text = new PointText(projectedPoint.xy.add(offset));
            text.content = String.fromCharCode(this.pointChar) + "'";
            stylesManager.applyTextStyle(text, 'pointText');
            textGroup.addChild(text);
        }
        if (projectedPoint.xz != null) {
            var text = new PointText(projectedPoint.xz.add(offset));
            text.content = String.fromCharCode(this.pointChar) + "''";
            stylesManager.applyTextStyle(text, 'pointText');
            textGroup.addChild(text);
        }
        if (projectedPoint.yz != null) {
            var text = new PointText(projectedPoint.yz.add(offset));
            text.content = String.fromCharCode(this.pointChar) + "'''";
            stylesManager.applyTextStyle(text, 'pointText');
            textGroup.addChild(text);
        }
        this.pointChar++;
        return textGroup;
    };

    this.resetPointText = function()
    {
        this.pointChar = 'A'.charCodeAt();
    };

    this.drawLinkLines = function (projectedPoint) {
        var linesGroup = new Group();
        if (projectedPoint.xy != null && projectedPoint.yz != null) {
            linesGroup.addChild(drawLinkLine(projectedPoint.xy, projectedPoint.yz));
        }
        if (projectedPoint.xy != null && projectedPoint.xz != null) {
            linesGroup.addChild(drawLinkLine(projectedPoint.xy, projectedPoint.xz));
        }
        if (projectedPoint.xz != null && projectedPoint.yz != null) {
            linesGroup.addChild(drawLinkLine(projectedPoint.xz, projectedPoint.yz));
        }
        return linesGroup;
    }
}