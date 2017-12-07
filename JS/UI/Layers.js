$(document).ready(function () {
    var layoutPanel = $("#layoutPanel");
    var addLayout = $("#addLayout");
    var AllLayoutPanel = $("#AllLayoutPanel");
    const removeLayoutName = 'removeLayout';
    const layoutNameName = 'layout';
    const someSwith = 'someSwitchLayout';
    const radioButtonLayoutName = 'radioButtonLayout';
    const removeNameForDelete = 'layoutID';

    var index = 1;//TODO убрать

    addLayout.click(function () {
        AddLayout(index);
    });
    function AddLayout(name){
            AllLayoutPanel.append(GenerateLayoutTemplate(name));
            BindEventForRemoveLayer(name);
            var tempRemoveNameForDelete = removeNameForDelete + name;
            layerManager.addLayer(tempRemoveNameForDelete);

    }
    function BindEventForRemoveLayer(name) {
        var tempRemoveLayoutName = '#' +  removeLayoutName + name;
        $(tempRemoveLayoutName).bind("click", function () {
            var id = $(this).attr("data-id");
            var name = $(this).attr("data-name");
            var elementForRemove = '#' + layoutNameName + id;
            $(elementForRemove).remove();
            layerManager.removeLayer(name);
            console.log('remove layer ' + name);
        });
    }
    function GenerateLayoutTemplate(layoutName) {
            var removeLayoutEventName = removeLayoutName + layoutName;
            var layoutNameEventName = layoutNameName + layoutName;
            var someSwitchEventName = someSwith + layoutName;
            var radioButtonEventName = radioButtonLayoutName + layoutName;
            var tempRemoveNameForDelete;
            if(typeof(layoutName) == "number"){
                tempRemoveNameForDelete  = removeNameForDelete + layoutName;
            }
            else{
                tempRemoveNameForDelete = layoutName;
            }

            var layoutTemplate = $('<li class="list-group-item" id="'+layoutNameEventName+'">'+layoutNameEventName+'<span data-name="'+tempRemoveNameForDelete+'" data-id="'+layoutName+'" id="'+removeLayoutEventName+'" class="glyphicon glyphicon-minus removeLayout" style="color:red;"></span>' +
                '<div class="material-switch pull-right">' +
                '<input id="'+ someSwitchEventName + '" name="'+someSwitchEventName+'" type="checkbox"/>' +
                '<label for="'+ someSwitchEventName + '" class="label-success"></label>'+
                '<input id="'+radioButtonEventName+'" type="radio" name="activelayout"></div></li>');

            index++; //TODO убрать
        return  layoutTemplate;
    }

    function RemoveAllLayers() {
        AllLayoutPanel.empty();
    }

    function MainPoint() {
        var layers = layerManager.getLayers();
        $.each(layers, function (index, infoObject) {
            AllLayoutPanel.append(GenerateLayoutTemplate(infoObject.name));
            BindEventForRemoveLayer(infoObject.name);
        })
    }
    MainPoint();
});

