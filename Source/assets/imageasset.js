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
    
    this.m_cOffset = new Vector(0, 0);
    
    this.m_nImageWidth = 0;
    this.m_nImageHeight = 0;
}

ImageAsset.prototype = new Asset();
ImageAsset.prototype.constructor = ImageAsset;

/**
 * Set rendering offset within image
 * 
 * @param {number} nTop
 * @param {number} nLeft
 */
ImageAsset.prototype.SetRenderOffset = function(nTop, nLeft){
    this.m_cOffset.x = nTop;
    this.m_cOffset.y = nLeft;
};

ImageAsset.prototype.Load = function(fOnLoad){
    var self = this;
    
    this.m_cBaseImage = new Image();
    this.m_cBaseImage.onload = function(){
        fOnLoad.apply(self);
        
        self.m_nImageWidth = this.width;
        self.m_nImageHeight = this.height;
        
        if (!self.m_cOptions.visibleWidth)
        {
            self.m_cOptions.visibleWidth = this.width;
        }
        
        if (!self.m_cOptions.visibleHeight)
        {
            self.m_cOptions.visibleHeight = this.height;
        }
    };

    this.m_cBaseImage.onerror = function(){
        fOnLoad(new Error("Failed to load image: " + this.m_sFileName));
    };
    
    this.m_cBaseImage.src = window.cannonQuest.resourcePath + "/images/" + this.m_sFileName;
};

ImageAsset.prototype.Draw = function(cRenderer){
    if (this.m_cOptions.tile)
    {
        //Lazy Load Required Pattern
        if (!this.m_cBasePattern)
        {
            this.m_cBasePattern = cRenderer.CreatePattern(this.m_cBaseImage);
        }
        
        cRenderer.DrawTiledImage(this.m_cBasePattern, this.m_cPos, this.m_cOptions.visibleWidth, this.m_cOptions.visibleHeight);
    }
    else
    {
        cRenderer.DrawImage(this.m_cBaseImage, this.m_cPos, this.m_cOptions.visibleWidth, this.m_cOptions.visibleHeight, this.m_cOffset.y, this.m_cOffset.x);
    }
};