$(document).ready(function () {
    var leftElementPanelHTML = $("#leftmenu");
    var rightElementPanelHTML = $("#rightmenu");
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

    var toggleLayoutPanel = $("#toggleLayoutPanel");

    var propertyPanel = $("#propertyPanel");

    var rightmenu = $("#rightmenu");
    leftElementPanelHTML.draggable({containment: "parent"});
    rightmenu.draggable({containment: "parent"});
    $('#layoutPanel').draggable({containment: "parent"});

    $(".colorpicker-component[data-setting]").colorpicker({
        colorSelectors: constColor,
    }).on('hidePicker', function () {
        settingsManager.setValue($(this).attr('data-setting'), $(this).colorpicker('getValue'));
    });
    $(".colorpicker-component[data-setting]").each(function (i, item) {
        var val = settingsManager.getValue($(item).attr('data-setting'));
        $(item).colorpicker('setValue', val);
    });


    toggleLayoutPanel.click(function () {
        propertyPanel.toggle();
    });

    $('.navbar-btn').click(function () {
        var navId = $(this).attr('id');
        var tab = $("[data-nav-id=" + navId + "]");
        if (tab.is(":visible")) {
            tab.hide("fast");
        }
        else {
            $("[data-nav-id]:visible").hide();
            tab.show();
        }
    });


    projectionManager.getTasks().forEach(function (task, i) {
        var list = $('.tasksList');
        var template = list.children().first();
        var listItem = template.clone();
        listItem.text(task);
        listItem.val(i);
        listItem.show();
        listItem.appendTo(list);
    });

    $('.tasksList li').click(function () {
        $('.tasksList li.active').removeClass('active');
        $(this).addClass('active');
        $('.taskText').text($(this).text());
        projectionManager.testMode = true;
    });

    $('.taskValidate').click(function () {
        var index = parseInt($('.tasksList li.active').first().val());
        var res = projectionManager.validateTask(index);
        var items = $('.taskErrors>li:not(:first-child)').each(function () {
            $(this).remove();
        });
        var list = $('.taskErrors');
        res.forEach(function (result) {
            var projValid = true;
            var pointsHtml = result.points.map(function (p) {
                if (p.xy && p.xz && p.yz) {
                    return '<li class="taskTrue">' + p.point.toString() + '<span class="glyphicon glyphicon-ok"></span></li>';
                }
                else if (!p.xy && !p.xz && !p.yz) {
                    projValid = false;
                    return '<li class="taskFalse">' + p.point.toString() + '<span class="glyphicon glyphicon-remove"></span></li>';
                }
                else {
                    projValid = false;
                    var xyHtml = p.xy ? '<span class="taskTrue">XY<span class="glyphicon glyphicon-ok"></span></span>' : '<span class="taskFalse">XY<span class="glyphicon glyphicon-remove"></span></span>';
                    var xzHtml = p.xz ? '<span class="taskTrue">XZ<span class="glyphicon glyphicon-ok"></span></span>' : '<span class="taskFalse">XZ<span class="glyphicon glyphicon-remove"></span></span>';
                    var yzHtml = p.yz ? '<span class="taskTrue">YZ<span class="glyphicon glyphicon-ok"></span></span>' : '<span class="taskFalse">YZ<span class="glyphicon glyphicon-remove"></span></span>';
                    return '<li class="taskFalse">' + p.point.toString() + ' ' + xyHtml + xzHtml + yzHtml + '</li>';
                }
            }).join('');
            var liClass = result.points
            list.append('<li class="'+(projValid?'taskTrue':'taskFalse')+'">' + result.shape + '<ul>'+pointsHtml+'</ul></li>');
        });
    });
    $('.taskCancel').click(function () {
        $('.tasksList li.active').removeClass('active');
        $('.taskText').text('');
        projectionManager.testMode = false;
    });


    $("input[type=number][data-setting]").change(function () {
        settingsManager.setValue($(this).attr("data-setting"), parseInt($(this).val()));
    });
    $("input[type=number][data-setting]").each(function () {
        var val = settingsManager.getValue($(this).attr("data-setting"));
        $(this).val(val);
    });


    $("input[type=checkbox][data-setting]").click(function () {
        if (!$(this).is(':checked')) {
            settingsManager.setValue($(this).attr("data-setting"), false);
        }
        else {
            settingsManager.setValue($(this).attr("data-setting"), true);
        }
    });
    $("input[type=checkbox][data-setting]").each(function () {
        var val = settingsManager.getValue($(this).attr("data-setting"));
        $(this).prop('checked', val);
    });

    $("input[data-slider-min]").bootstrapSlider();
    $("input[data-slider-min]").on("slide", function (slideEvt) {
        settingsManager.setValue($(this).attr('data-setting'), slideEvt.value);
        $(this).siblings(".valueLabel").text(slideEvt.value);
    });
    $("input[data-slider-min]").each(function (i, item) {
        var val = settingsManager.getValue($(item).attr('data-setting'));
        $(item).attr('data-slider-value', val);
        $(item).siblings(".valueLabel").text(val);
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

    $('#selectTypeLineText').on('change', function () {
        var lineType = $(this).val();
        if (lineType == 'Solid') {
            settingsManager.settings.textStyles.drawing.lineType = 'solid';
        }
        else if (lineType == 'Dotted') {
            settingsManager.settings.textStyles.drawing.lineType = 'dotted';
        }
        else if (lineType == 'Dashed') {
            settingsManager.settings.textStyles.drawing.lineType = 'dashed';
        }
        else if (lineType == 'DotDash') {
            settingsManager.settings.textStyles.drawing.lineType = 'dotDash';
        }
        else if (lineType == 'TwoDotsOneDash') {
            settingsManager.settings.textStyles.drawing.lineType = 'twoDotsOneDash';
        }
        else {
            settingsManager.settings.textStyles.drawing.lineType = 'solid';
        }
    });
    $('#selectFontWeight').on('change', function () {
        var lineType = $(this).val();
        if (lineType == 'Bold') {
            settingsManager.settings.textStyles.drawing.fontWeight = 'normal';
        }
        else if (lineType == 'Bolder') {
            settingsManager.settings.textStyles.drawing.fontWeight = 'bolder';
        }
        else if (lineType == 'Lighter') {
            settingsManager.settings.textStyles.drawing.fontWeight = 'lighter';
        }
        else if (lineType == 'Normal') {
            settingsManager.settings.textStyles.drawing.fontWeight = '100';
        }
    });
    $('#FontForText').on('change', function () {
        var fontName = $(this).val();
        if (fontName == 'sans-serif') {
            settingsManager.settings.textStyles.drawing.fontFamily = 'sans-serif';
            settingsManager.settings.textStyles.drawing.font = 'sans-serif';
        }
        else if (fontName == 'Arial Black') {
            settingsManager.settings.textStyles.drawing.fontFamily = 'sans-serif';
            settingsManager.settings.textStyles.drawing.font = 'sans-serif';
        }
        else if (fontName == 'Comic Sans MS') {
            settingsManager.settings.textStyles.drawing.fontFamily = 'cursive';
            settingsManager.settings.textStyles.drawing.font = 'cursive';
        }
        else if (fontName == 'MS Serif') {
            settingsManager.settings.textStyles.drawing.fontFamily = 'serif';
            settingsManager.settings.textStyles.drawing.font = 'serif';
        }

    });
    $('#controlLayersPanel').click(function () {
        $('#layersPanel').toggle();
    });
    $('#controlElementPanel').click(function () {
        $('#leftmenu').toggle();
    });
});
