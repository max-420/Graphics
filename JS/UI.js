$(document).ready(function () {
    var gridColorAxisHTML = $('#gridColorAxis');
    var gridColorPickerHTML = $('#gridColorPicker');
    var activeColorPickerHTML = $('#ActiveColorPicker');

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


    $('#undo').popover({ title: "Undo", content: "Undo", placement: "left", trigger: "hover" });
    $('#redo').popover({ title: "Redo", content: "Redo", placement: "bottom", trigger: "hover" });



    //bindingPanelSettings
    var checkBindingSettings = true;
    var leftElementPanelHTML = $("#leftmenu");

    var bindingPanelSettingssHTML = $("#bindingPanelSettings");
    var sizebindingPanelSettingss = parseInt(bindingPanelSettingssHTML.css("height"));
    var sizeLeftElementPanel = parseInt(leftElementPanelHTML.css("top"));
    
    $('#bindingSettings').click(function () {
        var bindingPanelSettingss = $("#bindingPanelSettings");

        if (checkBindingSettings) {
            bindingPanelSettingss.show("fast");
            leftElementPanelHTML.animate({ "top": sizeLeftElementPanel + sizebindingPanelSettingss }, "fast");
            checkBindingSettings = false;
        }
        else {
            bindingPanelSettingss.hide("fast");
            leftElementPanelHTML.animate({ "top": sizeLeftElementPanel }, "fast");
            checkBindingSettings = true;
        }
    });
    
    //mainPanelSettings  // mainSettings // mainPanelSettings

    var mainPanelSettintHTML = $("#mainPanelSettings");
    var sizeMainPanelSettings = parseInt(mainPanelSettintHTML.css("height"));
    var checkPanelSettings = true;

    $('#mainSettings').click(function () {
        var bindingPanelSettingss = $("#mainPanelSettings");

        if (checkPanelSettings) {
            bindingPanelSettingss.show("fast");
            leftElementPanelHTML.animate({ "top": sizeLeftElementPanel + sizeMainPanelSettings }, "fast");
            checkPanelSettings = false;
        }
        else {
            bindingPanelSettingss.hide("fast");
            leftElementPanelHTML.animate({ "top": sizeLeftElementPanel }, "fast");
            checkPanelSettings = true;
        }
    });

    //Grid  // gridSettings // gridPanelSettings

    var gridPanelSettings = $("#gridPanelSettings");
    var sizeGridPanel = parseInt(gridPanelSettings.css("height"));
    var checkgridPanelSettings = true;

    $('#gridSettings').click(function () {
        var bindingPanelSettingss = $("#gridPanelSettings");

        if (checkgridPanelSettings) {
            bindingPanelSettingss.show("fast");
            leftElementPanelHTML.animate({ "top": sizeLeftElementPanel + sizeGridPanel }, "fast");
            checkgridPanelSettings = false;
        }
        else {
            bindingPanelSettingss.hide("fast");
            leftElementPanelHTML.animate({ "top": sizeLeftElementPanel }, "fast");
            checkgridPanelSettings = true;
        }
    });

    //Close panel elements
    var closePanel = $("#ClosePanel");
    $(closePanel).click(function () {
            leftElementPanelHTML.animate({ "top": sizeLeftElementPanel }, "fast");
            bindingPanelSettingssHTML.hide("fast");
            bindingPanelSettingssHTML.animate({ "top": sizeLeftElementPanel }, "fast");
            mainPanelSettintHTML.hide("fast");
            mainPanelSettintHTML.animate({ "top": sizeLeftElementPanel }, "fast");
            gridPanelSettings.hide("fast");
            gridPanelSettings.animate({ "top": sizeLeftElementPanel }, "fast");
    });

    //
    //EVENT LIST FOR SET NEW VALUE
    var stepHTML = $('#step');
    var showGridHTML = $('#showGrid');
    var showAxisHTML = $('#showAxis');
    var stepBinderHTML = $('#BindingGrid');
    var stepBindingGridHTML = $('#stepBindingGrid');
    var strokeWidthHTML = $('#strokeWidth');
    var bindToLineEnds = $('#bindToLineEnds');
    var bindToIntersections = $('#bindToIntersections');
    var bindToCenters = $('#bindToCenters');

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
        if (!settingsManager.settings.background.showGrid) {
            showGridHTML.prop('checked', true);
        }
        if (settingsManager.settings.binding.bindToGrid) {
            stepBinderHTML.prop('checked', true);
        }
        if (!settingsManager.settings.binding.bindToGrid) {
            stepBinderHTML.prop('checked', false);
        }
        if (settingsManager.settings.binding.bindToLineEnds) {
            bindToLineEnds.prop('checked', true);
        }
        if (!settingsManager.settings.binding.bindToLineEnds) {
            bindToLineEnds.prop('checked', false);
        }
        if (settingsManager.settings.binding.bindToIntersections) {
            bindToIntersections.prop('checked', true);
        }
        if (!settingsManager.settings.binding.bindToIntersections) {
            bindToIntersections.prop('checked', false);
        }
        if (settingsManager.settings.binding.bindToCenters) {
            bindToCenters.prop('checked', true);
        }
        if (!settingsManager.settings.binding.bindToCenters) {
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