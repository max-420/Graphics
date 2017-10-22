function Tools(mediator, drawingSettings, drawingLayers, binding, previewLayer) {
    var line = new Line();
    var move = new Move();
    var hand = new Hand();
    var select = new Select();

    function Line() {
        var path;
        var line = new Tool();
        var mainLayer;
        var cancelled;
        line.minDistance = 10;

        line.onMouseDown = function (event) {
            cancelled = false;
            mainLayer = project.activeLayer;
            previewLayer.activate();
            path = new Path();
            var point = binding.getPoint(event.point);
            path.add(point);
            path.strokeColor = drawingSettings.strokeColor;
        }

        line.onMouseDrag = function (event) {
            if (cancelled) return;
            var point = binding.getPoint(event.point);
            path.add(point);
        }

        line.onMouseUp = function (event) {
            if (cancelled) return;
            mainLayer.addChild(path);
            mainLayer.activate();
            previewLayer.removeChildren();
            mediator.publish("drawingChanged");
        }

        line.onKeyDown = function (event) {
            if (event.key = 'escape') {
                cancelled = true;
                mainLayer.activate();
                previewLayer.removeChildren();
            }
        }
    };

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

    function ToolBuilder() {
        var cancelled;
        var tagretItems;
        var copy;
        var init = function (event) {

        }
        var finish = function () {
            mainLayer.activate();
            previewLayer.removeChildren();
            mediator.publish("drawingChanged");
        }
        var tool = new Tool();
        tool.onMouseDown = function (event) {
            cancelled = false;
            mainLayer = project.activeLayer;
            previewLayer.activate();
        }
        this.selectOneOrMany()
        {
            tool.onMouseDown+=function(event)
            {
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
            }
        }

    }
    function ToolWrapper(){

    }
}
