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
    this.settings = new Settings();

    setWrappers(this.settings,this);
    function setWrappers(source, dest, prevProps)
    {
        prevProps = prevProps || [];
        for (var s in source) {
            var context = {
                source: source,
                name: s.slice(0),
                prevProps: prevProps,
            }
            if(typeof(source[s]) == 'object')
            {
                // Object.defineProperty(dest, s, {
                //     //writable:false
                // });
                dest[s] = {};
                setWrappers(source[s],dest[s],prevProps.concat(s));
            }
            else
            {
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
        var json = JSON.stringify(this.settings);
        localStorage.setItem('settings',json);
    }.bind(this);
    this.loadSettings = function () {
        var json = localStorage.getItem('settings');
        var savedSettings = JSON.parse(json);
        $.extend( true,settings,savedSettings );
    };
}

var sss = new SettingsManager();
sss.drawing.strokeColor='white';
alert(sss.drawing.strokeColor);
alert(sss.background.gridStep);