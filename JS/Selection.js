function Selection(mediator, hitTestObj) {
    this.selectAll = function () {
        hitTestObj.selected = true;
    }
    this.deselectAll = function () {
        hitTestObj.selected = false;
    }
    this.getSelection = function () {
        return project.selectedItems;
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
        return hitResult.item;
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
        return project.selectedItems;
    }
}