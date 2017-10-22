function Background(mediator, backgroundSettings) {
    var layout = new Layer();

    view.translate(view.viewSize.divide(2));
    var redraw = function () {
        layout.removeChildren();
        if(!backgroundSettings.showGrid && !backgroundSettings.showAxis) return;
        var prevLayer = project.activeLayer;
        layout.activate();

        if(backgroundSettings.showGrid) drawGrid();
        if(backgroundSettings.showAxis) drawAxis();

        layout.style.strokeScaling = false;
        prevLayer.activate();
    }

    var drawGrid = function () {

        var boundRect = layout.view.bounds;
        var cellSize = backgroundSettings.gridStep;
        console.log(boundRect);
        console.log(cellSize);
        var grid = new Group();
        for (y = cellSize; y < boundRect.bottom; y += cellSize) {
            var rightPoint = [boundRect.right, y];
            var leftPoint = [boundRect.left, y];

            var gridLine = new Path.Line(rightPoint, leftPoint);
            grid.addChild(gridLine);
        }

        for (y = 0; y > boundRect.top; y -= cellSize) {
            var rightPoint = [boundRect.right, y];
            var leftPoint = [boundRect.left, y];

            var gridLine = new Path.Line(rightPoint, leftPoint);
            grid.addChild(gridLine);
        }

        for (x = 0; x > boundRect.left; x -= cellSize) {
            var topPoint = [x, boundRect.bottom];
            var bottomPoint = [x, boundRect.top];

            var gridLine = new Path.Line(topPoint, bottomPoint);
            grid.addChild(gridLine);
        }

        for (x =  cellSize; x < boundRect.right; x += cellSize) {
            var topPoint = [x, boundRect.bottom];
            var bottomPoint = [x, boundRect.top];

            var gridLine = new Path.Line(topPoint, bottomPoint);
            grid.addChild(gridLine);
        }

        grid.strokeColor = backgroundSettings.gridColor;
    }
    var drawAxis = function () {
        var boundRect = layout.view.bounds;

        var axisLeft = new Path([0, 0], [boundRect.left, 0]);
        var axisRight = new Path([0, 0], [boundRect.right, 0]);
        var axisBottom = new Path([0, 0], [0, boundRect.bottom]);
        var axisTop = new Path([0, 0], [0, boundRect.top]);

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
        redraw();
    });
    mediator.subscribe("fieldMoved", function () {
        redraw();
    });
}