function Tools(mediator, drawingSettings, drawingLayers, binding, previewLayer) {
    var line = new Line();
    var move = new Move();
    var hand = new Hand();
    var select = new Select();
    var circle = new Circle();

    function Line() {
        var path;
        var line = new DrawingTool();
        line.init = function(event, targetItems)
        {
            path = new Path();
            targetItems.addChild(path);
            var point = binding.getPoint(event.point);
            path.add(point);
            path.strokeColor = drawingSettings.strokeColor;
        }
        line.draw = function(event, targetItems)
        {
            var point = binding.getPoint(event.point);
            path.add(point);
        }
    }

    function Circle() {
        var path;
        var circle = new DrawingTool();
        var center;
        circle.init = function(event, targetItems)
        {
            center = binding.getPoint(event.point);
            path = new Path.Circle(center, 0);
            targetItems.addChild(path);
            path.strokeColor = drawingSettings.strokeColor;
        }
        circle.draw = function(event, targetItems)
        {
            var point = binding.getPoint(event.point);
            path.remove();
            path = new Path.Circle(center, point.getDistance(center));
            targetItems.addChild(path);
            path.strokeColor = drawingSettings.strokeColor;
        }
    }

    function Move() {
        var basePoint = new Point(0, 0);
        var lastPoint = new Point(0, 0);
        var deltaSum = new Point(0, 0);
        var move = new Tool();
        var targetItems;
        var copy;
        var mainLayer;
        var cancelled;
        move.onMouseDown = function (event) {
            var hitOptions = {
                segments: true,
                stroke: true,
                fill: true,
                tolerance: 5
            };
            if (project.selectedItems.length == 0) {
                var hitResult = drawingLayers.hitTest(event.point, hitOptions);
                if (hitResult) {
                    hitResult.item.selected = true;
                }
            }
            targetItems = new Group(project.selectedItems);

            cancelled = false;
            mainLayer = project.activeLayer;
            previewLayer.activate();

            deltaSum = new Point(0, 0);
            basePoint = binding.getPoint(event.point);
            lastPoint = basePoint;

            copy = targetItems.clone();
            previewLayer.addChild(copy);
            copy.selected = false;
        }
        move.onMouseDrag = function (event) {
            if (cancelled) return;
            var point = binding.getPoint(event.point);
            var delta = point.subtract(lastPoint);
            lastPoint = point;
            deltaSum = deltaSum.add(delta);
            copy.translate(delta);
        }
        move.onMouseUp = function (event) {
            if (cancelled) return;
            mainLayer.activate();
            targetItems.translate(deltaSum);
            previewLayer.removeChildren();
            mediator.publish("drawingChanged");
        }
        move.onKeyDown = function (event) {
            if (event.key = 'escape') {
                cancelled = true;
                mainLayer.activate();
                previewLayer.removeChildren();
            }
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
    function DrawingTool(){
        var cancelled;
        var targetItems;
        var copy;
        //this.init;
        //this.draw;
        var tool = new Tool();
        tool.minDistance = 2;

        tool.onMouseDown = function (event) {
            cancelled = false;
            mainLayer = project.activeLayer;
            previewLayer.activate();
            targetItems = new Group();

            if(this.init) this.init(event, targetItems);
        }.bind(this);

        tool.onMouseDrag = function (event) {
            if (cancelled) return;

            if(this.draw) this.draw(event, targetItems);
        }.bind(this);

        tool.onMouseUp = function (event) {
            if (cancelled) return;

            mainLayer.addChildren(targetItems.children);
            mainLayer.activate();
            previewLayer.removeChildren();
            mediator.publish("drawingChanged");
        }

        tool.onKeyDown = function (event) {
            if (event.key = 'escape') {
                cancelled = true;
                mainLayer.activate();
                previewLayer.removeChildren();
            }
        }.bind(this);
    }
}
