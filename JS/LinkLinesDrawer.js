function LinkLinesDrawer(mediator, stylesManager)
{
    this.drawLinkLine = function(point1, point2) {
        var lines = new Group();
        if((point1.x <0 && point1.y<0) || (point2.x <0 && point2.y<0))
        {
            lines.addChild(new Path(point1, point2));
        }
        else
        {
            var xpoint = point1.x>0 ? point1 : point2;
            var ypoint = point1.y>0 ? point1 : point2;
            lines.addChild(new Path(xpoint, [xpoint.x, 0]));
            lines.addChild(new Path(ypoint, [ 0, ypoint.y]));
            lines.addChild(new Path.Arc([xpoint.x, 0], [xpoint.x/Math.sqrt(2),ypoint.y/Math.sqrt(2)], [ 0, ypoint.y]));
        }
        stylesManager.applyStyle(lines, 'drawing');
    }
}