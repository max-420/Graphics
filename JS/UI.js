$(document).ready(function(){
    var gridColorAxisHTML =  $('#gridColorAxis');
    var gridColorPickerHTML = $('#gridColorPicker');
    var activeColorPickerHTML = $('#ActiveColorPicker');

    var constColor = { 'black': '#000000',
        'white': '#ffffff',
        'red': '#FF0000',
        'default': '#777777',
        'primary': '#337ab7',
        'success': '#5cb85c',
        'info': '#5bc0de',
        'warning':  '#f0ad4e',
        'danger': '#d9534f' };


    gridColorAxisHTML.colorpicker({ colorSelectors: constColor
    }).on('hidePicker',function ()
    {
        settingsManager.settings.background.axisColor = gridColorAxisHTML.colorpicker('getValue');
    });

    activeColorPickerHTML.colorpicker({ colorSelectors: constColor
    }).on('hidePicker',function ()
    {
        settingsManager.settings.drawing.strokeColor = activeColorPickerHTML.colorpicker('getValue');
    });

    gridColorPickerHTML.colorpicker({ colorSelectors: constColor
    }).on('hidePicker',function () {
        settingsManager.settings.background.gridColor = gridColorPickerHTML.colorpicker('getValue');
    });


    $('#undo').popover({title: "Undo", content: "Undo", placement: "left", trigger:"hover"});
    $('#redo').popover({title: "Redo", content: "Redo", placement: "bottom", trigger:"hover"});

    var check = true;
    var leftElementPanelHTML = $(".leftElementPanel");
    var rightElementPanelHTML = $(".rightElementPanel");
    var panelSettingsHTML = $("#panelSetting");


    var sizePanelSettings = parseInt(panelSettingsHTML.css("height"));
    var sizeLeftElementPanel = parseInt(leftElementPanelHTML.css("top"));
    var sizeRightElementPanel = parseInt(rightElementPanelHTML.css("top"));
    $('#settingBtn').click(function(){
        var panelSettings = $("#panelSetting");

        if(check){
            panelSettings.show("fast");
            leftElementPanelHTML.animate({"top":sizeLeftElementPanel + sizePanelSettings},"fast");
            rightElementPanelHTML.animate({"top":sizeRightElementPanel + sizePanelSettings},"fast");
            check = false;
        }
        else{
            panelSettings.hide("fast");
            leftElementPanelHTML.animate({"top" : sizeLeftElementPanel},"fast");
            rightElementPanelHTML.animate({"top" : sizeRightElementPanel},"fast");
            check = true;
        }

    });

    var closePanel = $("#ClosePanel");
    $(closePanel).click(function(){
        if(check == false){
            panelSettingsHTML.hide("fast");
            leftElementPanelHTML.animate({"top" : sizeLeftElementPanel},"fast");
            panelSettingsHTML.animate({"top" : sizeRightElementPanel},"fast");
            check = true;
        }
    });


    //EVENT LIST FOR SET NEW VALUE
    var stepHTML = $('#step');
    var showGridHTML = $('#showGrid');
    var showAxisHTML = $('#showAxis');
    var stepBinderHTML = $('#BindingGrid');
    var stepBindingGridHTML = $('#stepBindingGrid');
    var strokeWidthHTML = $('#strokeWidth');


    function SetSettingInHTMLElements() {
        gridColorAxisHTML.colorpicker('setValue', settingsManager.settings.background.axisColor);
        gridColorPickerHTML.colorpicker('setValue', settingsManager.settings.background.gridColor);
        activeColorPickerHTML.colorpicker('setValue', settingsManager.settings.drawing.strokeColor);

        stepHTML.val(settingsManager.settings.background.gridStep);
        stepBindingGridHTML.val(settingsManager.settings.binding.gridStep);
        strokeWidthHTML.val(settingsManager.settings.drawing.strokeWidth);

        if (settingsManager.settings.background.showAxis) {
            showAxisHTML.prop('checked', true);
        }
        if (settingsManager.settings.background.showGrid) {
            showGridHTML.prop('checked', true);
        }

    };
    SetSettingInHTMLElements();

    stepHTML.change(function () {
        settingsManager.settings.background.step = parseInt(stepHTML.val());
    });
    strokeWidthHTML.change(function () {
        settingsManager.settings.drawing.strokeWidth = strokeWidthHTML.val();
    });
    stepBindingGridHTML.change(function () {
        settingsManager.settings.binding.gridStep = stepBindingGridHTML.val();
    });

    showGridHTML.click(function () {
        if (!$(this).is(':checked')) {
            settingsManager.settings.background.showGrid = false;
        }
        else{
            settingsManager.settings.background.showGrid = true;
        }
    });
    showAxisHTML.click(function () {
        if (!$(this).is(':checked')) {
            settingsManager.settings.background.showAxis = false;
        }
        else{
            settingsManager.settings.background.showAxis = true;
        }
    });

    //stepBinding
    stepBinderHTML.click(function() {
        if (!$(this).is(':checked')) {
            settingsManager.settings.binding.bindToGrid = false;
            $('#stepBindingGrid').attr("disabled", "disabled");
        }
        else{
            settingsManager.settings.binding.bindToGrid = true;
            $('#stepBindingGrid').removeAttr("disabled");
        }
    });
});