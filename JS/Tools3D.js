function Tools3D(mediator, binding, drawer, selection, projectionPointsDrawer, projectionManager, projectionParams) {
    this.point = new Point3D(1);
    this.line = new Point3D(2);
    this.triangle = new Point3D(3);
    this.polygon = new Point3D();

    function Point3D(pointsCount) {
        var points = [];
        var tool = new Tool();
        var cancelled = false;
        var targetItems = new Group();
        var projection;
        var filter;
        function filterPoint(point) {
            if(filter === "xz")
            {
                return point.x<0 && point.y<0
            }
            if(filter === "xy")
            {
                return point.x<0 && point.y>0
            }
            if(filter === "yz")
            {
                return point.x>0 && point.y<0
            }
            return point.x<0 || point.y<0;
        }
        tool.onMouseMove = function (event) {
            if(!filterPoint(event.point))
            {
                return;
            }
            var bindedPoint = binding.drawPoint(event.point);
            if(!projection) return;
            if(projectionParams.showLinkLines) {
                var projections = projection.bind(bindedPoint);
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
            }

        }.bind(this);

        tool.onMouseDown = function (event) {
            if(!filterPoint(event.point))
            {
                return;
            }
            cancelled = false;
            if(!projection || function(){return pointsCount ? projection.validate(pointsCount):false}())
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

        this.activate = function (pointFilter) {
            filter = pointFilter;
            tool.activate();
            binding.clear();
        };
    }
}