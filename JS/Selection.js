function Selection(mediator, layerManager) {
    var hitTestObj = layerManager.userLayers;
    var selectedItems;
    var selectedItemsCopy;
    Object.defineProperty(this, "selectedItems", {
        get: function() {
            if(!this.anythingSelected()) return null;
            if(!selectedItemsCopy)
            {
                this.copySelection();
            }
            return selectedItemsCopy;
        }
    });
    this.copySelection = function () {
        selectedItems = new Group(project.selectedItems);
        selectedItemsCopy = selectedItems.clone();
        layerManager.activeUserLayer.addChild(selectedItems);
        selectedItemsCopy.selected = false;
    }
    this.saveSelection = function () {
        if (!selectedItemsCopy) return;
        selectedItemsCopy.selected = true;
        layerManager.activeUserLayer.addChildren(selectedItemsCopy.children);

        selectedItems.remove();
        selectedItemsCopy = null;
        selectedItems = null;

        layerManager.appLayers.children['preview'].removeChildren();
        mediator.publish("drawingChanged");
    }
    this.selectAll = function () {
        hitTestObj.selected = true;
    }
    this.deselectAll = function () {
        hitTestObj.selected = false;
    }
    this.anythingSelected = function() {
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
    this.selectInsideRectangle = function (rectangle) {
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
    this.selectCurve = function(point)
    {
        this.selectPoint(point);
        var hitOptions = {
            curves: true,
            tolerance: 10,
        };
        var hitResult =  this.selectedItems.hitTest(point, hitOptions);
        if(!hitResult) return null;
        hitResult.location.curve.selected = true;
        return hitResult.location.curve;
    }
}