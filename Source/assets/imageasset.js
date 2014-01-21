include("assets/asset.js", true);

/**
 * @class
 * @classdesc The ImageAsset class handles the drawing and loading of basic images such as pngs, jpegs, etc
 * 
 * @constructor
 * @param {string} sFileName - The filename of the image to loadind in the resourccs/images path eg. image.png
 * @param {object} cOptions - A list of options used to determine how the image draws and updates
 * @param {number} cOptions.visibleWidth - Used to clip the viewable area of an image. If null or unset will use images natural width
 * @param {number} cOptions.visibleHeight - Used to clip the viewable area of an image. If null or unset will use images natural height
 * @param {tile} cOptions.tile - Whether to tile the image within the viewable area. Defaults to false.
 * 
 * @extends Asset
 */
function ImageAsset(sFileName, cOptions)
{
    Asset.call(this, sFileName);
    
    var cDefaults = {
        visibleWidth: null,
        visibleHeight: null,
        tile: false
    };
    
    this.m_cOptions = extend(cDefaults, cOptions);
    
    this.m_cBaseImage = null;
    this.m_cBasePattern = null;
    
    this.Offset = new Vector(0, 0);
    
    this.m_nScale = 1;
    this.m_nHeight = 0;
    this.m_nWidth = 0;
    this.ImageHeight = 0;
    this.ImageWidth = 0;
}

inherits(ImageAsset, Asset);

Object.defineProperty(ImageAsset.prototype, "Width", {
    enumerable: true,
    get: function(){
        return this.m_nWidth;
    },
    set: function(nWidth){
        this.m_nWidth = nWidth * this.Scale;
    }
});

Object.defineProperty(ImageAsset.prototype, "Height", {
    enumerable: true,
    get: function(){
        return this.m_nHeight;
    },
    set: function(nHeight){
        this.m_nHeight = nHeight * this.Scale;
    }
});

Object.defineProperty(ImageAsset.prototype, "Scale", {
    enumerable: true,
    get: function(){
        return this.m_nScale;
    },
    set: function(nScale){
        this.m_nHeight = this.m_nHeight * (1 / this.m_nScale * nScale);
        this.m_nWidth = this.m_nWidth * (1 / this.m_nScale * nScale);
        this.m_nScale = nScale;
    }
});

ImageAsset.prototype.Load = function(fOnLoad){
    var self = this;
    
    this.m_cBaseImage = new Image();
    this.m_cBaseImage.onload = function(){
        fOnLoad.apply(self);
        
        self.ImageWidth = this.width;
        self.ImageHeight = this.height;
        
        self.Width = self.m_cOptions.visibleWidth || this.width;
        self.Height = self.m_cOptions.visibleHeight || this.height;
        
        self.BoundingBox.Width = self.Width;
        self.BoundingBox.Height = self.Height;
    };

    this.m_cBaseImage.onerror = function(){
        fOnLoad(new Error("Failed to load image: " + this.m_sFileName));
    };
    
    this.m_cBaseImage.src = window.EN.settings.resourcePath + "images/" + this.m_sFileName;
};

ImageAsset.prototype.Draw = function(cRenderer){
    if (this.m_cOptions.tile)
    {
        //Lazy Load Required Pattern
        if (!this.m_cBasePattern)
        {
            this.m_cBasePattern = cRenderer.CreatePattern(this.m_cBaseImage);
        }
        
        cRenderer.DrawTiledImage(this.m_cBasePattern, this.Pos, this.Offset, this.Width, this.Height);
    }
    else
    {
        cRenderer.DrawImage(this.m_cBaseImage, this.GetAlignedCoords(), this.m_cOptions.visibleWidth || this.ImageWidth, this.m_cOptions.visibleHeight || this.ImageHeight, this.Offset.x, this.Offset.y, this.Scale);
    }
};

//# sourceURL=assets/imageasset.js