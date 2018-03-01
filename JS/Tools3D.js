function Tools3D(mediator, binding, drawer, selection, stylesManager, projectionPointsDrawer, projectionParams) {
    this.point = new Point3D();
    function Point3D() {
        var points = [];
        var tool = new Tool();
        var cancelled = false;
        var targetItems;
        var projection = new Projection();
        projection.bindingTolerance = 10;
        tool.onMouseMove = function (event) {
            var bindedPoint = binding.drawPoint(event.point, function (p, tolerance) {
                var projections = projection.bind(p);
                if(projections) {
                    if (p.xy && p.xy.getDistance(event.point) < tolerance) return [p.xy];
                    if (p.xz && p.xz.getDistance(event.point) < tolerance) return [p.xz];
                    if (p.yz && p.yz.getDistance(event.point) < tolerance) return [p.yz];
                }
                return [];
            });
            var tolerance = projection.bindingTolerance;
            var projections = projection.bind(event.point);
            //projections = this.mergePoints(nearest, point3D);
            if(projections) {

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
            var point = binding.getPoint(event.point, function (p, tolerance) {
                var projections = projection.bind(p);
                if(projections) {
                    if (p.xy && p.xy.getDistance(event.point) < tolerance) return [p.xy];
                    if (p.xz && p.xz.getDistance(event.point) < tolerance) return [p.xz];
                    if (p.yz && p.yz.getDistance(event.point) < tolerance) return [p.yz];
                }
                return [];
            });
            projection.addPoint(point);
            targetItems = new Group();
            projectionPointsDrawer.resetPointText();
            projection.getProjections().forEach(function (proj) {
                targetItems.addChild(projectionPointsDrawer.drawLinkLines(proj));
                targetItems.addChild(projectionPointsDrawer.drawProjectedPoint(proj));
                if(projectionParams.showPointText)
                {
                    targetItems.addChild(projectionPointsDrawer.drawPointText(proj));
                }
            })
        }.bind(this);

        tool.onMouseDrag = function (event) {
            if (cancelled) return;
        }.bind(this);

        tool.onMouseUp = function (event) {
            if (cancelled) return;
            drawer.save(targetItems.children);
            targetItems.remove();
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