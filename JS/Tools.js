function Tools(mediator, drawingSettings, drawingLayers, binding, previewLayer) {
    this.line = new Line();
    this.move = new Move();
    this.hand = new Hand();
    this.select = new Select();
    this.circle = new Ellipse();
    this.scale = new Scale();
    this.rotate = new Rotate();
    this.pathLine = new PathLine();
    var drawer = new Drawer();

    function PathLine() {
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

    function Line() {
        var path;
        var startPoint;
        var line = new DrawingTool();
        line.init = function (event, targetItems) {
            path = new Path();
            targetItems.addChild(path);
            var point = binding.getPoint(event.point);
            startPoint = point;
        }
        line.draw = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            path.remove();
            path = new Path(startPoint, point);
            targetItems.addChild(path);
            path.strokeColor = drawingSettings.strokeColor;
            path.strokeWidth = drawingSettings.strokeWidth;
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

    function Ellipse() {
        var path;
        var tool = new DrawingTool();
        var center;
        tool.init = function (event, targetItems) {
            center = binding.getPoint(event.point);
            path = null;
        }
        tool.draw = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            if(path) path.remove();
            path = new Path.Ellipse(new Rectangle(center.multiply(2).subtract(point),point));;
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
            targetItems.scale(distance / lastDistance);
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
            targetItems.rotate(angle - lastAngle, pos);
            lastAngle = angle;
        }
    }

    function Hand() {
        var hand = new ToolWrapper();
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
        var select = new ToolWrapper();
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
            if (!selectMany) {
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
            if (!selectMany) return;
            var items = drawingLayers.getItems({inside: new Rectangle(startPoint, event.point)});
            items.forEach(function (item) {
                item.selected = true;
            })
            mainLayer.activate();
            previewLayer.removeChildren();
            selectMany = false;
        }
        this.activate = tool.activate;
    }

    function DrawingTool() {
        var targetItems;
        //this.init;
        //this.draw;
        var tool = new ToolWrapper();
        tool.showBindings = true;
        tool.onMouseDown = function (event) {
            previewLayer.activate();
            targetItems = new Group();
            if (this.init) this.init(event, targetItems);
        }.bind(this);

        tool.onMouseDrag = function (event) {
            if (this.draw) this.draw(event, targetItems);
        }.bind(this);

        tool.onMouseUp = function (event) {
            drawer.save(targetItems.children);
            targetItems.remove();
        }
        this.activate = tool.activate;
    }

    function TransformTool() {
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
                var point = binding.getPoint(event.point);
                var hitResult = drawingLayers.hitTest(point, hitOptions);
                if (hitResult) {
                    hitResult.item.selected = true;
                }
            }
        };
        var tool = new ToolWrapper();
        tool.showBindings = true;

        tool.onMouseDown = function (event) {
            this.selection(event);

            targetItems = drawer.getSelection();

            if (this.init) this.init(event, targetItems);
        }.bind(this);

        tool.onMouseDrag = function (event) {
            if (this.transform) this.transform(event, targetItems);
        }.bind(this);

        tool.onMouseUp = function (event) {
            drawer.saveSelection();
        }.bind(this);
        this.activate = tool.activate;
    }

    function Drawer() {
        var selectedItems;
        var selectedItemsCopy;
        this.getSelection = function () {
            selectedItems = new Group(project.selectedItems);
            selectedItemsCopy = selectedItems.clone();
            drawingLayers.addChild(selectedItems);
            previewLayer.addChild(selectedItemsCopy);
            selectedItemsCopy.selected = false;
            return selectedItemsCopy;
        }
        this.saveSelection = function () {
            if (!selectedItemsCopy) return;
            selectedItemsCopy.selected = true;
            drawingLayers.addChildren(selectedItemsCopy.children);
            selectedItems.remove();
            selectedItemsCopy = null;
            selectedItems = null;
            previewLayer.removeChildren();
            mediator.publish("drawingChanged");

        }
        this.save = function (newItems) {
            drawingLayers.addChildren(newItems);
            previewLayer.removeChildren();
            mediator.publish("drawingChanged");
        }
        this.delete = function (items) {
            items.forEach(function (item) {
                item.remove();
            });
            mediator.publish("drawingChanged");
        }
        this.cancel = function () {
            previewLayer.removeChildren();
            project.deselectAll();
        }
    }



    function ToolWrapper() {
        var tool = new Tool();
        //tool.minDistance = 5;
        this.cancelled = false;
        this.showBindings = false;

        tool.onMouseMove = function (event) {
            if (this.showBindings) binding.drawPoint(event.point);
            if (this.onMouseMove) this.onMouseMove(event);
        }.bind(this);

        tool.onMouseDown = function (event) {
            this.cancelled = false;
            if (this.onMouseDown) this.onMouseDown(event);
        }.bind(this);

        tool.onMouseDrag = function (event) {
            if (this.cancelled) return;
            if (this.showBindings) binding.drawPoint(event.point);
            if (this.onMouseDrag) this.onMouseDrag(event);
        }.bind(this);

        tool.onMouseUp = function (event) {
            if (this.cancelled) return;
            if (this.onMouseUp) this.onMouseUp(event);
        }.bind(this);

        tool.onKeyDown = function (event) {
            if (event.key == 'escape') {
                this.cancelled = true;
                drawer.cancel();
            }
            if (event.key == 'delete') {
                drawer.delete(project.selectedItems);
            }
            if (this.onKeyDown) this.onKeyDown(event);
        }.bind(this);
        this.activate = tool.activate;
    }
}
