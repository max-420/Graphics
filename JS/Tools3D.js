function Tools3D(mediator, binding, drawer, selection, projectionPointsDrawer, projectionManager) {
    this.point = new Polyline3D();
    function Polyline3D() {
        var tool = new Point3D();
        tool.shapeDrawer = function (points) {
            if (points.length < 2) return;
            var lines = new Group();
            for (var i = 1; i<points.length; i++)
            {
                lines.addChild(new Path.Line(points[i-1],points[i]));
            }
            if(points.length > 2)
            {
                lines.addChild(new Path.Line(points[0],points[points.length - 1]));
            }
            return lines;
        }
        this.activate = function () {
            tool.activate();
        };
    }

    function Point3D() {
        var points = [];
        var tool = new Tool();
        var cancelled = false;
        var targetItems = new Group();
        var projection;
        this.shapeDrawer = function () {
        };
        projection.bindingTolerance = 10;
        tool.onMouseMove = function (event) {
            var bindedPoint = binding.drawPoint(event.point);
            var tolerance = projection.bindingTolerance;
            var projections = projection.bind(bindedPoint);
            //projections = this.mergePoints(nearest, point3D);
            if (projections) {

                if (projections.xy != null) {
                    mediator.publish("bindingDrawingStarted");
                    projectionPointsDrawer.drawLinkLines(projections);
                    mediator.publish("bindingDrawingFinished");
                }
                if (projections.xz != null) {
                    mediator.publish("bindingDrawingStarted");
                    projectionPointsDrawer.drawLinkLines(projections);
                    mediator.publish("bindingDrawingFinished");
                }
                if (projections.yz != null) {
                    mediator.publish("bindingDrawingStarted");
                    projectionPointsDrawer.drawLinkLines(projections);
                    mediator.publish("bindingDrawingFinished");
                }
            }

        }.bind(this);

        tool.onMouseDown = function (event) {
            cancelled = false;
            if(!projection || projection.validate(3))
            {
                projection = new Projection();
                projectionManager.projections.push(projection);
            }
            var point = binding.getPoint(event.point);
            projection.addPoint(point);

            targetItems.remove();
            targetItems = new Group();
            targetItems.addChildren(projectionManager.redraw());

        }.bind(this);

        tool.onMouseDrag = function (event) {
            if (cancelled) return;
        }.bind(this);

        tool.onMouseUp = function (event) {
            if (cancelled) return;
            drawer.save([targetItems]);

        }.bind(this);

        tool.onKeyDown = function (event) {
            if (event.key == 'escape') {
                this.cancel();
                project.deselectAll();
            }
            if (event.key == 'delete') {
                drawer.delete(project.selectedItems);
            }
            if (this.onKeyDown) this.onKeyDown(event);
        }.bind(this);

        this.cancel = function () {
            cancelled = true;
            binding.clear();
            selection.deleteCopy();
            drawer.cancel();
        }

        this.activate = function () {
            tool.activate();
            binding.clear();
        };
    }
}