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
            cellSize: 5,
        };
    this.scaling =
        {
            step: 2,
            scalingStep: 0.1,
        };
}
function SettingsManager(mediator) {
    this.settings = {};
    var settingsObj = new Settings();
    setWrappers(settingsObj, this.settings);

    function setWrappers(source, dest, prevProps) {
        prevProps = prevProps || [];
        for (var s in source) {
            if (typeof(source[s]) == 'object') {
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
                        var path = prevProps.concat([this.name]).join('.');
                        mediator.publish("settingsChanged", path, value);
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
    }.bind(this);

    loadSettings();
}