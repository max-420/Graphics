function Tools(mediator, drawingSettings, drawingLayers)
{
    var path;
    // Only execute onMouseDrag when the mouse
    // has moved at least 10 points:
    var line = new Tool();
    line.minDistance = 10;

    line.onMouseDown = function (event) {
        // Create a new path every time the mouse is clicked
        path = new Path();
        path.add(event.point);
        path.strokeColor = drawingSettings.strokeColor;
    }

    line.onMouseDrag = function (event) {
        // Add a point to the path every time the mouse is dragged
        path.add(event.point);
    }

    line.onMouseUp = function (event) {
        // Add a point to the path every time the mouse is dragged
        mediator.publish("drawingChanged");
    }

    var move = new Tool();
    move.onMouseDown = function (event) {
        var hitOptions = {
            segments: true,
            stroke: true,
            fill: true,
            tolerance: 5
        };
        project.deselectAll();
        var hitResult = drawingLayers.hitTest(event.point, hitOptions);
        if (hitResult) {
            hitResult.item.selected = true;
        }
    }
    move.onMouseDrag = function (event) {
        project.selectedItems.forEach(function (item, i, arr) {
            item.position = new Point(item.position._x + event.delta.x, item.position._y + event.delta.y);
        });
    }

    move.onMouseUp = function (event) {
        mediator.publish("drawingChanged");
    }
    var hand = new Tool();
    hand.onMouseDrag = function (event) {
        view.translate(event.point.subtract(event.downPoint));
        mediator.publish("fieldMoved");
    }
}
