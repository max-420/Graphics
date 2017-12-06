function Layers(mediator) {
    this.appLayers = new Group();
    this.userLayers = new Group();
    var activeUserLayerName;

    Object.defineProperty(this, "activeUserLayer", {
        get: function() {
            return this.userLayers.children[activeUserLayerName];
        }
    });

    this.addLayer = function(name)
    {
        var layer = new Layer();
        var index = 1;
        if(!isNaN(parseInt(name)))
        {
            name = '_'+name;
        }
        var newName = name;
        while(this.userLayers.children[newName])
        {
            newName=name+(index++);
        }
        layer.name = newName;
        this.userLayers.addChild(layer);
        this.setActive(newName);
    }
    this.setActive = function(name)
    {
        activeUserLayerName = name;
    }
    this.hide = function(name)
    {
        this.userLayers.children[name].visible = false;
    }
    this.show = function(name)
    {
        this.userLayers.children[name].visible = true;
    }
    this.removeLayer = function(name)
    {
        if(this.userLayers.children.length == 1) return;
        if(this.userLayers.children[name] == this.activeUserLayer)
        {
            activeUserLayerName = this.userLayers.children[0].name;
        }
        this.userLayers.children[name].remove();
    }
    this.setPosition = function(name, position)
    {
        if(position != this.userLayers.children.length - 1)
        {
            this.userLayers.children[name].moveBelow(this.userLayers.children[position]);
        }
        else
        {
            this.userLayers.children[name].bringToFront();
        }
    }
    this.getLayers = function()
    {
        var activeLayer = this.activeUserLayer;
        return this.userLayers.children.map(function (layer) {
            var summary =
            {
                name:layer.name,
                visible:layer.visible,
                active:layer == activeLayer,
            }
            return summary;
        });
    }
    var initLayers = function ()
    {
        var background = new Layer();
        background.name = 'background';
        this.appLayers.addChild(background);

        var main = new Layer();
        main.name = 'main';
        this.userLayers.addChild(main);
        activeUserLayerName = 'main';

        var preview = new Layer();
        preview.name = 'preview';
        this.appLayers.addChild(preview);

        var binding = new Layer();
        binding.name = 'binding';
        this.appLayers.addChild(binding);

        preview.activate();
    }.bind(this)();


    mediator.subscribe("backgroundDrawingStarted", function () {
        this.appLayers.children['background'].removeChildren();
        this.appLayers.children['background'].activate();
    }.bind(this));
    mediator.subscribe("backgroundDrawingFinished", function () {
        this.appLayers.children['preview'].activate();
    }.bind(this));
    mediator.subscribe("bindingDrawingStarted", function () {
        this.appLayers.children['binding'].removeChildren();
        this.appLayers.children['binding'].activate();
    }.bind(this));
    mediator.subscribe("bindingDrawingFinished", function () {
        this.appLayers.children['preview'].activate();
    }.bind(this));
}