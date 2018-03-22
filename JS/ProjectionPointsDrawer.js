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
    this.drawPointText = function (projectedPoints) {
        var offset = new Point(10, -10);
        var titlesXY = [];
        var titlesYZ = [];
        var titlesXZ = [];
        var textGroup = new Group();

        for (var i = 0; i < projectedPoints.length; i++) {
            if (projectedPoints[i].xy != null) {
                var samePointFound = false;
                for (var j = 0; j < i; j++) {
                    if (projectedPoints[j].xy != null && projectedPoints[j].xy.equals(projectedPoints[i].xy)) {
                        samePointFound = true;
                        titlesXY[j].content += '=' + String.fromCharCode(this.pointChar) + "'";
                        break;
                    }
                }
                if (!samePointFound) {
                    var text = new PointText(projectedPoints[i].xy.add(offset));
                    text.content = String.fromCharCode(this.pointChar) + "'";
                    stylesManager.applyTextStyle(text, 'pointText');
                    textGroup.addChild(text);
                    titlesXY[i] = text;
                }
            }
            if (projectedPoints[i].xz != null) {
                var samePointFound = false;
                for (var j = 0; j < i; j++) {
                    if (projectedPoints[j].xz != null && projectedPoints[j].xz.equals(projectedPoints[i].xz)) {
                        samePointFound = true;
                        titlesXZ[j].content += '=' + String.fromCharCode(this.pointChar) + "''";
                        break;
                    }
                }
                if (!samePointFound) {
                    var text = new PointText(projectedPoints[i].xz.add(offset));
                    text.content = String.fromCharCode(this.pointChar) + "''";
                    stylesManager.applyTextStyle(text, 'pointText');
                    textGroup.addChild(text);
                    titlesXZ[i] = text;
                }
            }
            if (projectedPoints[i].yz != null) {
                var samePointFound = false;
                for (var j = 0; j < i; j++) {
                    if (projectedPoints[j].yz != null && projectedPoints[j].yz.equals(projectedPoints[i].yz)) {
                        samePointFound = true;
                        titlesYZ[j].content += '=' + String.fromCharCode(this.pointChar) + "'''";
                        break;
                    }
                }
                if (!samePointFound) {
                    var text = new PointText(projectedPoints[i].yz.add(offset));
                    text.content = String.fromCharCode(this.pointChar) + "'''";
                    stylesManager.applyTextStyle(text, 'pointText');
                    textGroup.addChild(text);
                    titlesYZ[i] = text;
                }
            }
            this.pointChar++;
        }

        return textGroup;
    };

    this.resetPointText = function () {
        this.pointChar = 'A'.charCodeAt();
    };

    this.drawLinkLines = function (projectedPoint) {
        var linesGroup = new Group();
        if (projectedPoint.xy != null && projectedPoint.yz != null) {
            var linkLine = drawLinkLine(projectedPoint.xy, projectedPoint.yz);
            linkLine.strokeColor = 'blue';
            linesGroup.addChild(linkLine);
        }
        if (projectedPoint.xy != null && projectedPoint.xz != null) {
            var linkLine = drawLinkLine(projectedPoint.xy, projectedPoint.xz);
            linkLine.strokeColor = 'red';
            linesGroup.addChild(linkLine);
        }
        if (projectedPoint.xz != null && projectedPoint.yz != null) {
            var linkLine = drawLinkLine(projectedPoint.xz, projectedPoint.yz);
            linkLine.strokeColor = 'green';
            linesGroup.addChild(linkLine);
        }
        return linesGroup;
    }
}