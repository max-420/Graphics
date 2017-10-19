function Tools(mediator, drawingSettings, drawingLayers) {
    var hand = new Hand();
    var move = new Move();
    var line = new Line();
    var select = new Select();

    function Line() {
        var path;
        var line = new Tool();
        line.minDistance = 10;

        line.onMouseDown = function (event) {
            path = new Path();
            path.add(event.point);
            path.strokeColor = drawingSettings.strokeColor;
        }

        line.onMouseDrag = function (event) {
            path.add(event.point);
        }

        line.onMouseUp = function (event) {
            mediator.publish("drawingChanged");
        }
    };

    function Move() {
        var move = new Tool();
        move.onMouseDown = function (event) {
            var hitOptions = {
                segments: true,
                stroke: true,
                fill: true,
                tolerance: 5
            };
            if(project.selectedItems.length == 0) {
                var hitResult = drawingLayers.hitTest(event.point, hitOptions);
                if (hitResult) {
                    hitResult.item.selected = true;
                }
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
        this.activate
    }

    function Hand() {
        var hand = new Tool();
        hand.onMouseDrag = function (event) {
            view.translate(event.point.subtract(event.downPoint));
            mediator.publish("fieldMoved");
        }
    }

    function Select() {
        var select = new Tool();
        select.onMouseDown = function (event) {
            var hitOptions = {
                segments: true,
                stroke: true,
                fill: true,
                tolerance: 5
            };

            var hitResult = drawingLayers.hitTest(event.point, hitOptions);
            if (hitResult) {
                hitResult.item.selected = true;
            }
        }
    }
}
