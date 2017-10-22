function Binding(mediator, bindingSettings) {

    this.getPoint = function (point) {
        var bindedPoint = point;
        if(bindingSettings.bindToGrid)
        {
            bindedPoint = bindToGrid(bindedPoint);
        }
        return bindedPoint;
    }

    function bindToGrid(point) {

        return point.divide(bindingSettings.gridStep).round().multiply(bindingSettings.gridStep);
    }
}