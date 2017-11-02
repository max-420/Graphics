function LineTypes() {
    var dashArrays =
    {
        solid : [],//обычная
        dotted : [1,2],//..........
        dashed : [5,4],//-------------------
        dotDash : [5,3,1,3],//-.-.-.-.-.-.-.-.-
        twoDotsOneDash : [5,2,1,2,1,2],//-..-..-..-..-..
    }
    
    this.getDashArray = function(lineType)
    {
        return dashArrays[lineType];
    };
}