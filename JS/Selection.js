function Selection(mediator, hitTestObj) {
    this.selectAll = function () {
        hitTestObj.selected = true;
    }
    this.deselectAll = function () {
        hitTestObj.selected = false;
    }
    this.anythingSelected = function()
    {
        return project.selectedItems.length > 0;
    }
    this.selectPoint = function (point) {
        this.deselectAll();
        var hitOptions = {
            segments: true,
            stroke: true,
            fill: true,
            tolerance: 5
        };
        var hitResult = hitTestObj.hitTest(point, hitOptions);
        if (hitResult) {
            hitResult.item.selected = true;
        }
    }
    this.selectRectangle = function (rectangle) {
        this.deselectAll();
        var items = hitTestObj.getItems({
            inside: rectangle,
            match: function(item)
            {
                return item.className != 'Layer';
            },
        });
        items.forEach(function (item) {
            item.selected = true;
        });
    }
}