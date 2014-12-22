function Color(r, g, b, a)
{
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
    this.a = isset(a) ? a : 1;
}

Color.prototype.toString = function(sFormat){
    sFormat = sFormat || "rgba";
    
    var sColor = "";
    
    switch (sFormat)
    {
        case "rgb":
            sColor = "rgb(" + this.r + "," + this.g + "," + this.b + ")";
            break;
        default:
            sColor = "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
            break;
    }
    
    return sColor;
};

Color.prototype.SetHex = function(sHex){
    var sShortHandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    
    sHex = sHex.replace(sShortHandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var aResult = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(sHex);
    
    if (aResult)
    {
        this.r = parseInt(aResult[1], 16);
        this.g = parseInt(aResult[2], 16);
        this.b = parseInt(aResult[3], 16);
    }
};

EN.Color = Color;
