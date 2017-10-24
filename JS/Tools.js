function Tools(mediator, drawingSettings, drawingLayers, binding, previewLayer) {
    var line = new Line();
    var move = new Move();
    var hand = new Hand();
    var select = new Select();
    var circle = new Circle();
    var scale = new Scale();
    var rotate = new Rotate();

    function Line() {
        var path;
        var line = new DrawingTool();
        line.init = function (event, targetItems) {
            path = new Path();
            targetItems.addChild(path);
            var point = binding.getPoint(event.point);
            path.add(point);
            path.strokeColor = drawingSettings.strokeColor;
            path.strokeWidth = drawingSettings.strokeWidth;
        }
        line.draw = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            path.add(point);
        }
    }

    function Circle() {
        var path;
        var circle = new DrawingTool();
        var center;
        circle.init = function (event, targetItems) {
            center = binding.getPoint(event.point);
            path = new Path.Circle(center, 0);
            targetItems.addChild(path);
            path.strokeColor = drawingSettings.strokeColor;
            path.strokeWidth = drawingSettings.strokeWidth;
        }
        circle.draw = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            path.remove();
            path = new Path.Circle(center, point.getDistance(center));
            targetItems.addChild(path);
            path.strokeColor = drawingSettings.strokeColor;
            path.strokeWidth = drawingSettings.strokeWidth;
        }
    }

    function Move() {
        var lastPoint = new Point(0, 0);
        var move = new TransformTool();
        move.init = function (event, targetItems) {
            deltaSum = new Point(0, 0);
            lastPoint = binding.getPoint(event.point);
        }
        move.transform = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            var delta = point.subtract(lastPoint);
            lastPoint = point;
            targetItems.translate(delta);
        }
    }

    function Scale() {
        var lastDistance;
        var move = new TransformTool();
        move.init = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            lastDistance = targetItems.position.getDistance(point);
        }
        move.transform = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            var distance = targetItems.position.getDistance(point);
            targetItems.scale(distance/lastDistance);
            lastDistance = distance;
        }
    }
    function Rotate() {
        var lastAngle;
        var pos;
        var move = new TransformTool();
        move.init = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            pos = targetItems.position;
            lastAngle = point.subtract(pos).angle;
        }
        move.transform = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            var angle = point.subtract(pos).angle;
            targetItems.rotate(angle-lastAngle, pos);
            lastAngle = angle;
        }
    }

    function Hand() {
        var hand = new Tool();
        hand.onMouseDrag = function (event) {
            view.translate(event.point.subtract(event.downPoint));
            mediator.publish("fieldMoved");
        }
    }

    function Select() {
        var selectMany;
        var startPoint;
        var selectionRect;
        var mainLayer;
        var select = new Tool();
        select.onMouseDown = function (event) {
            var hitOptions = {
                segments: true,
                stroke: true,
                fill: true,
                tolerance: 5
            };
            startPoint = event.point;
            var hitResult = drawingLayers.hitTest(event.point, hitOptions);
            if (hitResult) {
                hitResult.item.selected = !hitResult.item.selected;
            }
        }
        select.onMouseDrag = function (event) {
            if(!selectMany)
            {
                mainLayer = project.activeLayer;
                previewLayer.activate();
                selectMany = true;
            }
            var prev = selectionRect;
            selectionRect = new Path.Rectangle(startPoint, event.point);
            selectionRect.strokeColor = 'grey';
            selectionRect.strokeWidth = 1;
            selectionRect.dashArray = [10, 4];
            selectionRect.strokeScaling = false;
            if (prev) prev.remove();
        }
        select.onMouseUp = function (event) {
            if(!selectMany) return;
            var items = drawingLayers.getItems({inside: new Rectangle(startPoint, event.point)});
            items.forEach(function (item) {
                item.selected = true;
            })
            mainLayer.activate();
            previewLayer.removeChildren();
            selectMany = false;
        }
    }

    function DrawingTool() {
        var cancelled;
        var targetItems;
        //this.init;
        //this.draw;
        var tool = new Tool();
        tool.minDistance = 2;

        tool.onMouseDown = function (event) {
            if(this.selection) this.selection(event);

            cancelled = false;
            mainLayer = project.activeLayer;
            previewLayer.activate();
            targetItems = new Group();

            if (this.init) this.init(event, targetItems);
        }.bind(this);

        tool.onMouseDrag = function (event) {
            if (cancelled) return;

            if (this.draw) this.draw(event, targetItems);
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
                project.deselectAll();
            }
        }.bind(this);
    }
    function TransformTool(){
        var cancelled;
        var selection;
        var targetItems;
        //this.init;
        //this.transform;
        this.selection = function (event) {
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
        }
        var tool = new Tool();
        tool.minDistance = 2;

        tool.onMouseDown = function (event) {
            if(this.selection) this.selection(event);

            selection = new Group(project.selectedItems);
            cancelled = false;
            mainLayer = project.activeLayer;
            previewLayer.activate();

            targetItems = selection.clone();
            previewLayer.addChild(targetItems);
            targetItems.selected = false;

            if(this.init) this.init(event, targetItems);
        }.bind(this);

        tool.onMouseDrag = function (event) {
            if (cancelled) return;

            if(this.transform) this.transform(event, targetItems);
        }.bind(this);

        tool.onMouseUp = function (event) {
            if (cancelled) return;

            targetItems.selected = true;
            mainLayer.addChildren(targetItems.children);
            selection.remove();
            mainLayer.activate();
            previewLayer.removeChildren();
            mediator.publish("drawingChanged");
        }.bind(this);

        tool.onKeyDown = function (event) {
            if (event.key = 'escape') {
                cancelled = true;
                mainLayer.activate();
                previewLayer.removeChildren();
                project.deselectAll();
            }
        }.bind(this);
    }
}
