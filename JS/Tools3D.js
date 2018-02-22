function Tools3D(mediator, binding, drawer, selection, stylesManager, linkLinesDrawer)
{
    this.point = new Point3D();
    function Point3D() {
        var stage = 0;
        var points = [];
        var tool = new Tool();
        var cancelled = false;
        var targetItems;
        function getProjection(point)
        {
            if(point.x<0 && point.y<0)
            {
                return 'x';
            }
            if(point.x<0 && point.y>0)
            {
                return 'y';
            }
            if(point.x>0 && point.y<0)
            {
                return 'z';
            }
            return null;
        }
        tool.onMouseMove = function (event) {
            binding.drawPoint(event.point);
        }.bind(this);

        tool.onMouseDown = function (event) {
            cancelled = false;
            if(stage==0) stage++;
            var point = binding.getPoint(event.point);

            if(stage == 1)
            {
                targetItems = new Group();
                points = [];
                points.push(point);
                stage++;
            }
            else if(stage == 2)
            {
                var projections = [
                    {
                        point:points[0],
                        proj:getProjection(points[0])
                    },
                    {
                        point:point,
                        proj:getProjection(point)
                    }];
                projections.sort(function compare(a, b) {
                    return a.proj > b.proj ? 1:-1;
                });
                if(projections[0].proj == projections[1].proj) return;
                if(projections[0].proj=='x' && projections[1].proj=='y')
                {
                    if(projections[0].point.x != projections[1].point.x) return;
                    points.push(point);
                    points.push(new Point(projections[1].point.y,projections[0].point.y));
                    var icon = new Path.Circle(points[2], 5);
                    targetItems.addChild(icon);
                    linkLinesDrawer.drawLinkLine(points[0], point);
                    linkLinesDrawer.drawLinkLine(points[0], points[2]);
                    linkLinesDrawer.drawLinkLine(points[1], points[2]);
                }
                if(projections[0].proj=='x' && projections[1].proj=='z')
                {
                    if(projections[0].point.y != projections[1].point.y) return;
                    points.push(point);
                    points.push(new Point(projections[0].point.x, projections[1].point.x));
                    var icon = new Path.Circle(points[2], 5);
                    targetItems.addChild(icon);
                    linkLinesDrawer.drawLinkLine(points[0], point);
                    linkLinesDrawer.drawLinkLine(points[0], points[2]);
                    linkLinesDrawer.drawLinkLine(points[1], points[2]);
                }
                if(projections[0].proj=='y' && projections[1].proj=='z')
                {
                    if(projections[0].point.y != projections[1].point.x) return;
                    points.push(point);
                    points.push(new Point(projections[0].point.x,projections[1].point.y));
                    var icon = new Path.Circle(points[2], 5);
                    targetItems.addChild(icon);
                    linkLinesDrawer.drawLinkLine(points[0], point);
                    linkLinesDrawer.drawLinkLine(points[0], points[2]);
                    linkLinesDrawer.drawLinkLine(points[1], points[2]);
                }
                stage = 0;
            }
            var icon = new Path.Circle(point, 5);
            targetItems.addChild(icon);

            stylesManager.applyStyle(targetItems, 'drawing');
        }.bind(this);

        tool.onMouseDrag = function (event) {
            if (cancelled) return;
        }.bind(this);

        tool.onMouseUp = function (event) {
            if (cancelled) return;
            stylesManager.applyStyle(targetItems, 'drawing');
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

        this.cancel = function()
        {
            cancelled = true;
            binding.clear();
            selection.deleteCopy();
            drawer.cancel();
        }

        this.activate = function(){
            tool.activate();
            binding.clear();
        };
    }
}