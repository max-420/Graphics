function Layers() {
    var dashArrays =
        {
            solid : [],//обычная
            dotted : [1,2],//..........
            dashed : [5,4],//-------------------
            dotDash : [5,3,1,3],//-.-.-.-.-.-.-.-.-
            twoDotsOneDash : [5,2,1,2,1,2],//-..-..-..-..-..
        }
    var userLayers = [];

    this.addLayer = function(name)
    {
        return dashArrays[lineType];
    };
    this.setActive(name)
    {
        userLayers[name].activate();
    }
    this.deleteLayer(name)
    {
        userLayers[name].remove();
    }
}