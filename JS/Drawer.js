function Drawer(mediator, layerManager) {

    this.save = function (newItems) {
        layerManager.activeUserLayer.addChildren(newItems);
        //previewLayer.removeChildren();
        mediator.publish("drawingChanged");
    }
    this.delete = function (items) {
        items.forEach(function (item) {
            item.remove();
        });
        mediator.publish("drawingChanged");
    }
    this.cancel = function () {
        layerManager.appLayers.children['preview'].removeChildren();
    }
}