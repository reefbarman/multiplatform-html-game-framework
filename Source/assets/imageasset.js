include("assets/asset.js", true);
include("assets/assetmanager.js", true);

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
    this._Asset(sFileName);

    var cDefaults = {
        visibleWidth: null,
        visibleHeight: null,
        tile: false
    };
    
    this.m_cOptions = extend(cDefaults, isset(cOptions) ? cOptions : {});
    
    this.m_cBaseImage = null;
    this.m_cBasePattern = null;
    
    this.m_bLoaded = false;
    
    this.Offset = new EN.Vector(0, 0);
    
    this.ImageHeight = 0;
    this.ImageWidth = 0;
    
    this.Alpha = 1;
}

inherits(ImageAsset, EN.Asset);

Object.defineProperty(ImageAsset.prototype, "BaseImage", {
    get: function(){
        return this.m_cBaseImage;
    }
});

ImageAsset.prototype.Load = function(fOnLoad){
    var self = this;
    
    EN.AssetManager.LoadImage(this.m_sFileName, function(cErr, cImage){
        if (cErr)
        {
            fOnLoad(cErr);
        }
        else
        {
            self.m_cBaseImage = cImage;
            
            self.ImageWidth = cImage.width;
            self.ImageHeight = cImage.height;
        
            self.Width = self.m_cOptions.visibleWidth || self.ImageWidth;
            self.Height = self.m_cOptions.visibleHeight || self.ImageHeight;
            
            self.m_bLoaded = true;
            
            fOnLoad.apply(self);
        }
    });
};

ImageAsset.prototype.Draw = function(cRenderer){
    if (!this.m_bLoaded)
    {
        throw new Error("Image Asset NOT LOADED: " + this.m_sFileName);
    }
    
    this._Draw_Asset(cRenderer);
    
    if (this.m_cOptions.tile)
    {
        //Lazy Load Required Pattern
        if (!this.m_cBasePattern)
        {
            this.m_cBasePattern = cRenderer.CreatePattern(this.m_cBaseImage);
        }
        
        cRenderer.DrawTiledImage(this.GlobalTransform, this.m_cBasePattern, this.Width, this.Height, this.Offset, this.Alpha);
    }
    else
    {
        cRenderer.DrawImage(this.GlobalTransform, this.m_cBaseImage, this.Width, this.Height, this.Offset, this.Alpha);
    }
};

ImageAsset.prototype.CleanUp = function(){
    this._CleanUp_Asset();
    EN.AssetManager.ReleaseImage(this.m_sFileName);
};

EN.ImageAsset = ImageAsset;
