function configuration(checkBindingSettings, checkGridSetting, checkLeftPanelShow, checkMainSetting, showLeftPanel) {
        this.checkBindingSettings = checkBindingSettings;
        this.checkGridSetting = checkGridSetting;
        this.checkLeftPanelShow = checkLeftPanelShow;
        this.checkMainSetting = checkMainSetting;
        this.showLeftPanel = showLeftPanel;
};
var conf = new configuration(true,true,true,true, true);
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
    var gridColorStroke = $("#gridColorStroke");
    var gridColorFillColor = $("#gridColorFillColor");
    var showElementPanel = $("#showElementPanel");

    //SET SETTING ON COLORPICKER
    gridColorAxisHTML.colorpicker({
        colorSelectors: constColor
    }).on('hidePicker', function () {
        settingsManager.settings.background.axisColor = gridColorAxisHTML.colorpicker('getValue');
    });

    activeColorPickerHTML.colorpicker({
        colorSelectors: constColor
    }).on('hidePicker', function () {
        settingsManager.settings.styles.drawing.strokeColor = activeColorPickerHTML.colorpicker('getValue');
    });

    gridColorPickerHTML.colorpicker({
        colorSelectors: constColor
    }).on('hidePicker', function () {
        settingsManager.settings.background.gridColor = gridColorPickerHTML.colorpicker('getValue');
    });

    gridColorStroke.colorpicker({
        colorSelectors: constColor
    }).on('hidePicker', function () {
        settingsManager.settings.styles.drawing.strokeColor = gridColorStroke.colorpicker('getValue');
    });
    gridColorFillColor.colorpicker({
        colorSelectors: constColor
    }).on('hidePicker', function () {
        settingsManager.settings.styles.drawing.fillColor = gridColorFillColor.colorpicker('getValue');
    });



    var sizeLeftElementPanel = parseInt(leftElementPanelHTML.css("top"));
    
    $('#bindingSettings').click(function () {
        if (conf.checkBindingSettings) {
            CloseAllPanels();
            leftPanelShow();
            bindingPanelSettingss.show();
            conf.checkBindingSettings = false;
        }
        else if (!conf.checkBindingSettings){
            leftPanelHide();
            bindingPanelSettingss.hide("fast");
            conf.checkBindingSettings = true;
        }
    });
    showElementPanel.click(function () {
        leftElementPanelHTML.toggle();
    });
    var sizeMainPanelSetting = parseInt(mainPanelSetting.css("height"));
    //mainPanelSettings  // mainSettings // mainPanelSettings
    $('#mainSettings').click(function () {
        if (conf.checkMainSetting) {
            CloseAllPanels();
            leftPanelShow();
            mainPanelSetting.show();
            conf.checkMainSetting = false;
        }
        else if(!conf.checkMainSetting){
            leftPanelHide();
            mainPanelSetting.hide();
            conf.checkMainSetting = true;
        }
    });

    //Grid  // gridSettings // gridPanelSettings
    var sizeGridPanel = parseInt(gridPanelSettings.css("height"));
    $('#gridSettings').click(function () {
        if (conf.checkGridSetting) {
                CloseAllPanels();
                leftPanelShow();
                gridPanelSettings.show();
                conf.checkGridSetting = false;
        }
        else if (!conf.checkGridSetting){
                leftPanelHide();
                gridPanelSettings.hide();
                conf.checkGridSetting = true;
        }
    });

    //Close panel elements
    var closePanel = $("#ClosePanel");
    closePanel.click(function () {
        CloseAllPanels();
        leftPanelHide();
    });

    function CloseAllPanels(){
            if(!conf.checkBindingSettings){
                bindingPanelSettingss.hide("fast");
                conf.checkBindingSettings = true;
            }
            if(!conf.checkGridSetting){
                gridPanelSettings.hide("fast");
                conf.checkGridSetting = true;
            }
            if(!conf.checkMainSetting){
                mainPanelSetting.hide("fast");
                conf.checkMainSetting = true;
            }
    }

    function leftPanelShow(){
        if(conf.checkLeftPanelShow){
            leftElementPanelHTML.animate({ "top": sizeLeftElementPanel + 250 });
            conf.checkLeftPanelShow = false;
        }

    }
    function leftPanelHide() {
        if(!conf.checkLeftPanelShow){
            leftElementPanelHTML.animate({ "top": sizeLeftElementPanel });
            conf.checkLeftPanelShow = true;
        }

    }

    function SetSettingInHTMLElements() {
        gridColorAxisHTML.colorpicker('setValue', settingsManager.settings.background.axisColor);
        gridColorPickerHTML.colorpicker('setValue', settingsManager.settings.background.gridColor);
        activeColorPickerHTML.colorpicker('setValue', settingsManager.settings.styles.drawing.strokeColor);

        stepHTML.val(settingsManager.settings.background.gridStep);
        stepBindingGridHTML.val(settingsManager.settings.binding.gridStep);
        strokeWidthHTML.val(settingsManager.settings.styles.drawing.strokeWidth);


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
        settingsManager.settings.background.gridStep = parseInt(stepHTML.val());
    });
    strokeWidthHTML.change(function () {
        settingsManager.settings.styles.drawing.strokeWidth = strokeWidthHTML.val();
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
            settingsManager.settings.styles.binding.bindToCenters = false;
        }
        else {
            settingsManager.settings.styles.binding.bindToCenters = true;
        }
    });


    //stepBinding
    stepBinderHTML.click(function () {
        if (!$(this).is(':checked')) {
            settingsManager.settings.binding.bindToGrid = false;
            HideStepGridHTML();
        }
        else {
            settingsManager.settings.binding.bindToGrid = true;
            ShowStepGridHTML();
        }
    });

    function ShowStepGridHTML() {
        $('#stepBindingGrid').removeAttr("disabled");
    }

    function HideStepGridHTML() {
        $('#stepBindingGrid').attr("disabled", "disabled");
    }

    $("#bootstrap-slider").slider();
    $("#bootstrap-slider").on("slide", function (slideEvt) {
        settingsManager.settings.styles.drawing.strokeWidth = slideEvt.value;
        $("#sliderValue").text(slideEvt.value);
    });

    $('.slider').on("click", function () {
        $("#sliderValue").text(newvalue);
    });

    $("#OpacitySetting").slider();
    $("#OpacitySetting").on("slide", function (slideEvt) {
        settingsManager.settings.styles.drawing.opacity = slideEvt.value;
        $("#OpacityValue").text(slideEvt.value);
    });

    $('.slider').on("click", function () {
        $("#OpacityValue").text(newvalue);
    });


    //
    $("#LineScalingSetting").slider();
    $("#LineScalingSetting").on("slide", function (slideEvt) {
        settingsManager.settings.styles.drawing.lineScaling = slideEvt.value;
        $("#LineScalingValue").text(slideEvt.value);
    });

    $('.slider').on("click", function () {
        $("#LineScalingValue").text(newvalue);
    });
    $('#selectTyleLine').on('change', function () {
        var lineType = $(this).val();
        if (lineType == 'Solid') {
            settingsManager.settings.styles.drawing.lineType = 'solid';
        }
        else if (lineType == 'Dotted') {
            settingsManager.settings.styles.drawing.lineType = 'dotted';
        }
        else if (lineType == 'Dashed') {
            settingsManager.settings.styles.drawing.lineType = 'dashed';
        }
        else if (lineType == 'DotDash') {
            settingsManager.settings.styles.drawing.lineType = 'dotDash';
        }
        else if (lineType == 'TwoDotsOneDash') {
            settingsManager.settings.styles.drawing.lineType = 'twoDotsOneDash';
        }
        else {
            settingsManager.settings.styles.drawing.lineType = 'solid';
        }
    });
});