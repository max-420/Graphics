$(document).ready(function () {
    //VARIABLE LIST
    var gridColorAxisHTML = $('#gridColorAxis');
    var gridColorPickerHTML = $('#gridColorPicker');
    var activeColorPickerHTML = $('#ActiveColorPicker');
    var leftElementPanelHTML = $("#leftmenu");
    var constColor = {
        'black': '#000000',
        'white': '#ffffff',
        'red': '#FF0000',
        'default': '#777777',
        'primary': '#337ab7',
        'success': '#5cb85c',
        'info': '#5bc0de',
        'warning': '#f0ad4e',
        'danger': '#d9534f'
    };
    var stepHTML = $('#step');
    var showGridHTML = $('#showGrid');
    var showAxisHTML = $('#showAxis');
    var stepBinderHTML = $('#BindingGrid');
    var stepBindingGridHTML = $('#stepBindingGrid');
    var strokeWidthHTML = $('#strokeWidth');
    var bindToLineEnds = $('#bindToLineEnds');
    var bindToIntersections = $('#bindToIntersections');
    var bindToCenters = $('#bindToCenters');
    //Panels
    var mainPanelSetting = $("#mainPanelSettings");
    var gridPanelSettings = $("#gridPanelSettings");
    var bindingPanelSettingss = $("#bindingPanelSettings");

    //SET SETTING ON COLORPICKER
    gridColorAxisHTML.colorpicker({
        colorSelectors: constColor
    }).on('hidePicker', function () {
        settingsManager.settings.background.axisColor = gridColorAxisHTML.colorpicker('getValue');
    });

    activeColorPickerHTML.colorpicker({
        colorSelectors: constColor
    }).on('hidePicker', function () {
        settingsManager.settings.drawing.strokeColor = activeColorPickerHTML.colorpicker('getValue');
    });

    gridColorPickerHTML.colorpicker({
        colorSelectors: constColor
    }).on('hidePicker', function () {
        settingsManager.settings.background.gridColor = gridColorPickerHTML.colorpicker('getValue');
    });
    //ENG SETTING ON COLORPICKER
    //bindingPanelSettings
    var CheckAllPanel = true; //VARIABLE FOR close panel


    var checkBindingSettings = true;
    var checkMainSetting = true;
    var checkGridSetting = true;

    var sizebindingPanelSettingss = parseInt(bindingPanelSettingss.css("height"));
    var sizeLeftElementPanel = parseInt(leftElementPanelHTML.css("top"));
    
    $('#bindingSettings').click(function () {
        if (checkBindingSettings) {
            if(CheckAllPanel){
                bindingPanelSettingss.show("fast");
                leftElementPanelHTML.animate({ "top": sizeLeftElementPanel + sizebindingPanelSettingss }, "fast");
                checkBindingSettings = false;
                CheckAllPanel = false;
            }
        }
        else if (!checkBindingSettings){
            if(!CheckAllPanel){
                bindingPanelSettingss.hide("fast");
                leftElementPanelHTML.animate({ "top": sizeLeftElementPanel }, "fast");
                checkBindingSettings = true;
                CheckAllPanel = true;
            }
        }
    });

    var sizeMainPanelSetting = parseInt(mainPanelSetting.css("height"));
    //mainPanelSettings  // mainSettings // mainPanelSettings
    $('#mainSettings').click(function () {
        if (checkMainSetting) {
            if(CheckAllPanel){
                mainPanelSetting.show("fast");
                leftElementPanelHTML.animate({ "top": sizeLeftElementPanel + sizeMainPanelSetting }, "fast");
                checkMainSetting = false;
                CheckAllPanel = false;
            }
        }
        else if(!checkMainSetting){
            if(!CheckAllPanel) {
                mainPanelSetting.hide("fast");
                leftElementPanelHTML.animate({"top": sizeLeftElementPanel}, "fast");
                checkMainSetting = true;
                CheckAllPanel = true;
            }
        }
    });
    //Grid  // gridSettings // gridPanelSettings
    var sizeGridPanel = parseInt(gridPanelSettings.css("height"));

    $('#gridSettings').click(function () {

        if (checkGridSetting) {
            if(CheckAllPanel) {
                gridPanelSettings.show("fast");
                leftElementPanelHTML.animate({"top": sizeLeftElementPanel + sizeGridPanel}, "fast");
                checkGridSetting = false;
                CheckAllPanel = false;
            }
        }
        else if (!checkGridSetting){
            if(!CheckAllPanel) {
                gridPanelSettings.hide("fast");
                leftElementPanelHTML.animate({"top": sizeLeftElementPanel}, "fast");
                checkGridSetting = true;
                CheckAllPanel = true;
            }
        }
    });

    //Close panel elements
    var closePanel = $("#ClosePanel");
    closePanel.click(function () {
        if (!CheckAllPanel) {
            if(!checkBindingSettings){
                bindingPanelSettingss.hide("fast");
                leftElementPanelHTML.animate({ "top": sizeLeftElementPanel }, "fast");
                checkBindingSettings = true;
                CheckAllPanel = true;
            }
            if(!checkGridSetting){
                gridPanelSettings.hide("fast");
                leftElementPanelHTML.animate({ "top": sizeLeftElementPanel }, "fast");
                checkGridSetting = true;
                CheckAllPanel = true;
            }
            if(!checkMainSetting){
                mainPanelSetting.hide("fast");
                leftElementPanelHTML.animate({ "top": sizeLeftElementPanel }, "fast");
                checkMainSetting = true;
                CheckAllPanel = true;
            }
        }

    });



    function SetSettingInHTMLElements() {
        gridColorAxisHTML.colorpicker('setValue', settingsManager.settings.background.axisColor);
        gridColorPickerHTML.colorpicker('setValue', settingsManager.settings.background.gridColor);
        activeColorPickerHTML.colorpicker('setValue', settingsManager.settings.drawing.strokeColor);

        stepHTML.val(settingsManager.settings.background.gridStep);
        stepBindingGridHTML.val(settingsManager.settings.binding.gridStep);
        strokeWidthHTML.val(settingsManager.settings.drawing.strokeWidth);


        if (settingsManager.settings.background.showGrid) {
            showGridHTML.prop('checked', true);
        }
        else if (!settingsManager.settings.background.showGrid) {
            showGridHTML.prop('checked', true);
        }

        if (settingsManager.settings.background.showAxis) {
            showAxisHTML.prop('checked', true);
        }
        else if (!settingsManager.settings.background.showAxis) {
            showAxisHTML.prop('checked', true);
        }
        if (settingsManager.settings.binding.bindToGrid) {
            stepBinderHTML.prop('checked', true);
        }
        else if (!settingsManager.settings.binding.bindToGrid) {
            stepBinderHTML.prop('checked', false);
        }
        if (settingsManager.settings.binding.bindToLineEnds) {
            bindToLineEnds.prop('checked', true);
        }
        else if (!settingsManager.settings.binding.bindToLineEnds) {
            bindToLineEnds.prop('checked', false);
        }
        if (settingsManager.settings.binding.bindToIntersections) {
            bindToIntersections.prop('checked', true);
        }
        else if (!settingsManager.settings.binding.bindToIntersections) {
            bindToIntersections.prop('checked', false);
        }
        if (settingsManager.settings.binding.bindToCenters) {
            bindToCenters.prop('checked', true);
        }
        else if (!settingsManager.settings.binding.bindToCenters) {
            bindToCenters.prop('checked', false);
        }


    };
    SetSettingInHTMLElements();

    stepHTML.change(function () {
        alert(parseInt(stepHTML.val()));
        settingsManager.settings.background.step = parseInt(stepHTML.val());
    });
    strokeWidthHTML.change(function () {
        settingsManager.settings.drawing.strokeWidth = strokeWidthHTML.val();
    });
    stepBindingGridHTML.change(function () {
        settingsManager.settings.binding.gridStep = stepBindingGridHTML.val();
    });


    showAxisHTML.click(function () {
        if (!$(this).is(':checked')) {
            settingsManager.settings.background.showAxis = false;
        }
        else {
            settingsManager.settings.background.showAxis = true;
        }
    });

    showGridHTML.click(function () {
        if (!$(this).is(':checked')) {
            settingsManager.settings.background.showGrid = false;
        }
        else {
            settingsManager.settings.background.showGrid = true;
        }
    });
    bindToIntersections.click(function () {
        if (!$(this).is(':checked')) {
            settingsManager.settings.background.bindToIntersections = false;
        }
        else {
            settingsManager.settings.background.bindToIntersections = true;
        }
    });


    bindToLineEnds.click(function () {
        if (!$(this).is(':checked')) {
            settingsManager.settings.binding.bindToLineEnds = false;
        }
        else {
            settingsManager.settings.binding.bindToLineEnds = true;
        }
    });

    bindToLineEnds.click(function () {
        if (!$(this).is(':checked')) {
            settingsManager.settings.binding.bindToLineEnds = false;
        }
        else {
            settingsManager.settings.binding.bindToLineEnds = true;
        }
    });

    bindToCenters.click(function () {
        if (!$(this).is(':checked')) {
            settingsManager.settings.binding.bindToCenters = false;
        }
        else {
            settingsManager.settings.binding.bindToCenters = true;
        }
    });


    //stepBinding
    stepBinderHTML.click(function () {
        if (!$(this).is(':checked')) {
            settingsManager.settings.binding.bindToGrid = false;
            $('#stepBindingGrid').attr("disabled", "disabled");
        }
        else {
            settingsManager.settings.binding.bindToGrid = true;
            $('#stepBindingGrid').removeAttr("disabled");
        }
    });
});