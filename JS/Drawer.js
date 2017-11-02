function Drawer(mediator, drawingSettings, drawingLayers, previewLayer, lineTypes) {
    var selectedItems;
    var selectedItemsCopy;
    this.getSelection = function () {
        selectedItems = new Group(project.selectedItems);
        selectedItemsCopy = selectedItems.clone();
        drawingLayers.addChild(selectedItems);
        previewLayer.addChild(selectedItemsCopy);
        selectedItemsCopy.selected = false;
        return selectedItemsCopy;
    }
    this.saveSelection = function () {
        if (!selectedItemsCopy) return;
        selectedItemsCopy.selected = true;
        drawingLayers.addChildren(selectedItemsCopy.children);
        selectedItems.remove();
        selectedItemsCopy = null;
        selectedItems = null;
        previewLayer.removeChildren();
        mediator.publish("drawingChanged");

    }
    this.save = function (newItems) {
        drawingLayers.addChildren(newItems);
        previewLayer.removeChildren();
        mediator.publish("drawingChanged");
    }
    this.delete = function (items) {
        items.forEach(function (item) {
            item.remove();
        });
        mediator.publish("drawingChanged");
    }
    this.cancel = function () {
        previewLayer.removeChildren();
        project.deselectAll();
    }
    this.applyDrawingSettings = function (items) {
        items.forEach(function (item) {
            item.strokeColor = drawingSettings.strokeColor;
            item.strokeWidth = drawingSettings.strokeWidth;
            item.strokeScaling = drawingSettings.strokeScaling;
            item.dashArray = lineTypes.getDashArray(drawingSettings.lineType);
            item.strokeCap = 'round';
        });
    }
}