function Tools(mediator, drawingLayers, binding, drawer, stylesManager) {
    this.rectangle = new Rect();
    this.polygon = new Polygon();
    this.star = new Star();
    this.line = new Line();
    this.move = new Move();
    this.hand = new Hand();
    this.select = new Select();
    this.ellipse = new Ellipse();
    this.circle = new Circle();
    this.scale = new Scale();
    this.rotate = new Rotate();
    this.pathLine = new PathLine();

    function PathLine() {
        var path;
        var line = new DrawingTool();
        line.init = function (event, targetItems) {
            path = new Path();
            targetItems.addChild(path);
            var point = binding.getPoint(event.point);
            path.add(point);
        }
        line.draw = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            path.add(point);
        }
        this.activate = function(){line.activate()};
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
        }
        this.activate = function(){line.activate()};
    }

    function Rect() {
        var path;
        var startPoint;
        var rectangle = new DrawingTool();
        rectangle.init = function (event, targetItems) {
            startPoint = binding.getPoint(event.point);
            path = new Path.Rectangle(startPoint, startPoint);
            targetItems.addChild(path);
        }
        rectangle.draw = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            path.remove();
            path = new Path.Rectangle(startPoint, point);
            targetItems.addChild(path);
        }
        this.activate = function(){rectangle.activate()};
    }

    function Polygon() {
        var path;
        var tool = new DrawingTool();
        var center;
        tool.init = function (event, targetItems) {
            center = binding.getPoint(event.point);
            path = new Path.RegularPolygon(center, 5, 0);
            targetItems.addChild(path);
        }
        tool.draw = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            path.remove();
            path = new Path.RegularPolygon(center,5, point.getDistance(center));
            targetItems.addChild(path);
        }
        this.activate = function(){tool.activate()};
    }

    function Star() {
        var path;
        var tool = new DrawingTool();
        var center;
        tool.init = function (event, targetItems) {
            center = binding.getPoint(event.point);
            path = new Path.Star(center, 5, 0,0);
            targetItems.addChild(path);
        }
        tool.draw = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            path.remove();
            path = new Path.Star(center,5,point.getDistance(center)/2, point.getDistance(center));
            targetItems.addChild(path);
        }
        this.activate = function(){tool.activate()};
    }

    function Circle() {
        var path;
        var circle = new DrawingTool();
        var center;
        circle.init = function (event, targetItems) {
            center = binding.getPoint(event.point);
            path = new Path.Circle(center, 0);
            targetItems.addChild(path);
        }
        circle.draw = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            path.remove();
            path = new Path.Circle(center, point.getDistance(center));
            targetItems.addChild(path);
        }
        this.activate = function(){circle.activate()};
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
            if (path) path.remove();
            path = new Path.Ellipse(new Rectangle(center.multiply(2).subtract(point), point));
            targetItems.addChild(path);
        }
        this.activate = function(){tool.activate()};
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
        this.activate = function(){move.activate()};
    }

    function Scale() {
        var lastDistance;
        var tool = new TransformTool();
        tool.init = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            lastDistance = targetItems.position.getDistance(point);
        }
        tool.transform = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            var distance = targetItems.position.getDistance(point);
            targetItems.scale(distance / lastDistance);
            lastDistance = distance;
        }
        this.activate = function(){tool.activate()};
    }

    function Rotate() {
        var lastAngle;
        var pos;
        var tool = new TransformTool();
        tool.init = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            pos = targetItems.position;
            lastAngle = point.subtract(pos).angle;
        }
        tool.transform = function (event, targetItems) {
            var point = binding.getPoint(event.point);
            var angle = point.subtract(pos).angle;
            targetItems.rotate(angle - lastAngle, pos);
            lastAngle = angle;
        }
        this.activate = function(){tool.activate()};
    }

    function Hand() {
        var hand = new ToolWrapper();
        hand.onMouseDrag = function (event) {
            view.translate(event.point.subtract(event.downPoint));
            mediator.publish("fieldMoved");
        }
        this.activate = function(){hand.activate()};
    }

    function Select() {
        var selectMany;
        var startPoint;
        var selectionRect;
        var tool = new ToolWrapper();
        tool.onMouseDown = function (event) {
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
        tool.onMouseDrag = function (event) {
            if (!selectMany) {
                selectMany = true;
            }
            var prev = selectionRect;
            selectionRect = new Path.Rectangle(startPoint, event.point);
            stylesManager.applyDrawingSettings(selectionRect,'selection');
            if (prev) prev.remove();
        }
        tool.onMouseUp = function (event) {
            if (!selectMany) return;
            var items = drawingLayers.getItems({inside: new Rectangle(startPoint, event.point)});
            items.forEach(function (item) {
                item.selected = true;
            })
            drawer.cancel();
            selectMany = false;
        }
        this.activate = function(){tool.activate()};
    }

    function DrawingTool() {
        var targetItems;
        //this.init;
        //this.draw;
        var tool = new ToolWrapper();
        tool.showBindings = true;
        tool.onMouseDown = function (event) {
            targetItems = new Group();
            if (this.init) this.init(event, targetItems);
            stylesManager.applyDrawingSettings(targetItems, 'drawing');
        }.bind(this);

        tool.onMouseDrag = function (event) {
            if (this.draw) this.draw(event, targetItems);
            stylesManager.applyDrawingSettings(targetItems, 'drawing');
        }.bind(this);

        tool.onMouseUp = function (event) {
            drawer.save(targetItems.children);
            targetItems.remove();
        }
        this.activate = function(){tool.activate()};
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
        this.activate = function(){tool.activate()};
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
                project.deselectAll();
            }
            if (event.key == 'delete') {
                drawer.delete(project.selectedItems);
            }
            if (this.onKeyDown) this.onKeyDown(event);
        }.bind(this);
        this.activate = function(){tool.activate()};
    }
}