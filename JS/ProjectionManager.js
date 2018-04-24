function ProjectionManager(mediator, projectionPointsDrawer, stylesManager, projectionParams) {
    this.projections = [];
    this.graphics = [];
    this.testMode = false;
    this.tasks = [
        [
            new Projection('point', [new Point3D(90, 90, 90)]),
            new Projection('point', [new Point3D(120, 120, 120)])
        ],
        [
            new Projection('point', [new Point3D(90, 90, 90)]),
            new Projection('line', [new Point3D(120, 120, 120), new Point3D(150, 150, 150)])
        ],
    ];

    this.bind = function (point) {
        return this.projections.find(function (proj) {
            var point3D = proj.get3DPoint(point);
            var nearest = proj.getNearestPoint(point3D);
            if (nearest != null) {
                return true;
            }
        });
    };

    this.getTasks = function () {
        return this.tasks.map(function (t) {
            return this.getTaskText(t);
        }.bind(this));
    };

    this.getTaskText = function (task) {
        var result = "";
        result += 'Построить ';
        task.forEach(function (subtask) {
            if (subtask.shape == 'point') {
                result += 'точку ';
            }
            if (subtask.shape == 'line') {
                result += 'отрезок ';
            }
            if (subtask.shape == 'polygon') {
                result += 'многоугольник ';
            }
            if (subtask.shape == 'ellipse') {
                result += 'эллипс ';
            }
            result += 'с координатами ';
            subtask.points3D.forEach(function (p, i, arr) {
                result += p.toString();
                if (i != arr.length - 1) {
                    result += ','
                }
                result += ' ';
            });
            result += ', ';
        });
        return result;
    };
    this.getShapeText = function (task) {
        var result = "";
        if (task.shape == 'polygon') {
            if (task.points3D.length == 1) {
                result += 'точка ';
            }
            if (task.points3D.length == 2) {
                result += 'отрезок ';
            }
            if (task.points3D.length == 3) {
                result += 'многоугольник ';
            }
            task.points3D.forEach(function (p, i, arr) {
                result += p.toString();
                if (i != arr.length - 1) {
                    result += ','
                }
                result += ' ';
            });
        }
        return result;
    };

    this.validateTask = function (taskIndex) {
        var task = this.tasks[taskIndex];
        var results = [];
        var resolvedProjections = [];
        var unresolvedProjections = this.projections.slice(0);
        var unresolvedTasks = task.filter(function (taskproj) {
            var match = unresolvedProjections.find(function (p) {
                return p.getMatches(taskproj) == taskproj.points3D.length * 3 && p.shape === taskproj.shape && p.points3D.length == taskproj.points3D.length * 3;
            });
            if (match) {
                unresolvedProjections.splice(unresolvedProjections.indexOf(match), 1);
                results.push(match.validateTask(taskproj));
                resolvedProjections.push(match);
                return false;
            }
            return true;
        }.bind(this));

        unresolvedTasks = unresolvedTasks.filter(function (taskproj) {
            var match = unresolvedProjections.filter(function (p) {
                return p.shape === taskproj.shape;
            }).sort(function (a, b) {
                return b.getMatches(taskproj) - a.getMatches(taskproj);
            })[0];
            if (match && match.getMatches(taskproj) != 0) {
                unresolvedProjections.splice(unresolvedProjections.indexOf(match), 1);
                results.push(match.validateTask(taskproj));
                return false;
            }
            return true;
        });
        unresolvedTasks.forEach(function (t) {
            var points = t.points3D.map(function (p) {
                var res =
                {
                    point:p,
                    xy:false,
                    xz:false,
                    yx:false
                };
                return res;
            });
            results.push({
                shape:t.shape,
                points:points,
            });
        }.bind(this));


        projectionPointsDrawer.graphics.forEach(function (g) {
            g.remove();
        });
        projectionPointsDrawer.redraw(this.projections);
        return results;
    };
    this.removeInvalidProjections = function () {
        this.projections = this.projections.filter(
            function (p1) {

            }
        )
    }
}