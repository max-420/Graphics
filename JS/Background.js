function Background(mediator, backgroundSettings) {
    var layout = new Layer();
    var margin = 200;
    var lastBounds = new Rectangle(view.bounds.point.subtract(margin), view.size.add(margin));
    view.translate(view.viewSize.divide(2));
    var redraw = function () {
        console.log("redraw");
        lastBounds = new Rectangle(view.bounds.point.subtract(margin), view.size.add(margin));
        if (!backgroundSettings.showGrid && !backgroundSettings.showAxis) return;
        var prevLayer = project.activeLayer;
        layout.activate();
        var prevState = new Group([layout.firstChild, layout.lastChild]);
        if (backgroundSettings.showGrid) drawGrid();
        if (backgroundSettings.showAxis) drawAxis();
        layout.style.strokeScaling = false;
        prevState.removeChildren();
        prevState.remove();
        prevLayer.activate();

    }

    var drawGrid = function () {
        var scaledMargin = margin;
        var boundRect = view.bounds;
        var cellSize = backgroundSettings.gridStep;
        var grid = new Group();

        var rightPoint = [boundRect.right + scaledMargin, 0];
        var leftPoint = [boundRect.left - scaledMargin, 0];
        var horLine = new Symbol(new Path.Line(rightPoint, leftPoint));
        var topPoint = [0, boundRect.bottom + scaledMargin];
        var bottomPoint = [0, boundRect.top - scaledMargin];
        var vertLine = new Symbol(new Path.Line(topPoint, bottomPoint));
        horLine.definition.strokeColor = backgroundSettings.gridColor;
        vertLine.definition.strokeColor = backgroundSettings.gridColor;
        horLine.definition.strokeScaling = false;
        vertLine.definition.strokeScaling = false;
        var yStart = Math.round((boundRect.top - scaledMargin) / cellSize) * cellSize;

        for (y = yStart; y < boundRect.bottom + scaledMargin; y += cellSize) {
            grid.addChild(horLine.place(new Point(view.center.x, y)));
        }
        var xStart = Math.round((boundRect.left - scaledMargin) / cellSize) * cellSize;
        for (x = xStart; x < boundRect.right + scaledMargin; x += cellSize) {
            grid.addChild(vertLine.place(new Point(x, view.center.y)));
        }


    }
    var drawAxis = function () {
        var scaledMargin = margin;
        var boundRect = view.bounds;

        var axisLeft = new Path([0, 0], [boundRect.left - scaledMargin, 0]);
        var axisRight = new Path([0, 0], [boundRect.right + scaledMargin, 0]);
        var axisBottom = new Path([0, 0], [0, boundRect.bottom + scaledMargin]);
        var axisTop = new Path([0, 0], [0, boundRect.top - scaledMargin]);

        var axis = new Group([axisLeft, axisRight, axisBottom, axisTop]);

        axis.strokeColor = backgroundSettings.axisColor;
        axis.strokeWidth = backgroundSettings.strokeWidth;
    }
    redraw();
    mediator.subscribe("settingsChanged", function (path, value) {
            redraw();
        },
        {
            predicate: function (path, value) {
                return path.startsWith("background");
            },
        });
    mediator.subscribe("fieldScaled", function () {
        if (!lastBounds.contains(view.bounds)) {
            redraw();
        }
    });
    mediator.subscribe("fieldMoved", function () {
        if (!lastBounds.contains(view.bounds)) {
            redraw();
        }
    });
}