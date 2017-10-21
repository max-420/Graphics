function Tools(mediator, drawingSettings, drawingLayers, binding) {
    var line = new Line();
    var move = new Move();
    var hand = new Hand();
    var select = new Select();

    function Line() {
        var path;
        var line = new Tool();
        line.minDistance = 10;

        line.onMouseDown = function (event) {
            path = new Path();
            var point = binding.getPoint(event.point);
            path.add(point);
            path.strokeColor = drawingSettings.strokeColor;
        }

        line.onMouseDrag = function (event) {
            var point = binding.getPoint(event.point);
            path.add(point);
        }

        line.onMouseUp = function (event) {
            mediator.publish("drawingChanged");
        }
    };

    function Move() {
        var basePoint = new Point(0,0);
        var lastPoint = new Point(0,0);
        var deltaSum = new Point(0,0);
        var move = new Tool();
        move.onMouseDown = function (event) {
            var hitOptions = {
                segments: true,
                stroke: true,
                fill: true,
                tolerance: 5
            };
            basePoint =  binding.getPoint(event.point);
            lastPoint = basePoint;
            if(project.selectedItems.length == 0) {
                var hitResult = drawingLayers.hitTest(event.point, hitOptions);
                if (hitResult) {
                    hitResult.item.selected = true;
                }
            }
        }
        move.onMouseDrag = function (event) {
            var point = binding.getPoint(event.point);
            var delta = point.subtract(lastPoint);
            lastPoint = point;
            deltaSum = deltaSum.add(delta);
            project.selectedItems.forEach(function (item, i, arr) {
                item.position = new Point(item.position._x + delta.x, item.position._y + delta.y);
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
