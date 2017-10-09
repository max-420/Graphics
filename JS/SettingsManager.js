function Settings() {
    this.drawing =
        {
            strokeColor: 'black',
            strokeWidth: 1,
            strokeScaling: true,
        };
    this.background =
        {
            axisColor: 'red',
            gridColor: 'orange',
            gridStep: 5,
        };
}
function SettingsManager() {
    this.settings = {};
    var settingsObj = new Settings();

    loadSettings();

    setWrappers(settingsObj, this.settings);

    function setWrappers(source, dest, prevProps) {
        prevProps = prevProps || [];
        for (var s in source) {
            if (typeof(source[s]) == 'object') {
                // Object.defineProperty(dest, s, {
                //     //writable:false
                // });
                dest[s] = {};
                setWrappers(source[s], dest[s], prevProps.concat(s));
                Object.defineProperty(dest, s, {
                    writable:false
                });
            }
            else {
                var context = {
                    source: source,
                    name: s.slice(0),
                    prevProps: prevProps,
                }
                Object.defineProperty(dest, s, {
                    get: function () {
                        return this.source[this.name];
                    }.bind(context),

                    set: function (value) {
                        this.source[this.name] = value;
                        saveSettings();
                    }.bind(context),
                });
            }
        }
    }

    var saveSettings = function ()
    {
        var json = JSON.stringify(settingsObj);
        localStorage.setItem('settings',json);
    }.bind(this);

    var loadSettings = function () {
        var json = localStorage.getItem('settings');
        var savedSettings = JSON.parse(json);
        $.extend( true,settingsObj,savedSettings );
    };
}

var sss = new SettingsManager();
sss.settings.drawing.strokeColor='white';
alert(sss.settings.drawing.strokeColor);
alert(sss.settings.background.gridStep);