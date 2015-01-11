include("assets/asset.js", true);
include("assets/assetmanager.js", true);

/**
 * @class
 * @classdesc The ImageAsset class handles the drawing and loading of basic images such as pngs, jpegs, etc
 * 
 * @constructor
 * @param {string} sFileName - The filename of the image to load in the resourccs/images path eg. image.png
 * @param {object} cOptions - A list of options used to determine how the image draws and updates
 * @param {number} cOptions.visibleWidth - Used to clip the viewable area of an image. If null or unset will use images natural width
 * @param {number} cOptions.visibleHeight - Used to clip the viewable area of an image. If null or unset will use images natural height
 * @param {object} cOptions.offset - The offset to clip the image at using x and y coords eg {x: 10, y: 20}, defaults to {x: 0, y: 0}
 * @param {Image} cOptions.baseImage - The base image for the asset to use if it was preloaded. Defaults to null
 * @param {bool} cOptions.tile - Whether to tile the image within the viewable area. Defaults to false.
 * 
 * @extends Asset
 */
function ImageAsset(sFileName, cOptions)
{
    this._Asset(sFileName);

    var cDefaults = {
        visibleWidth: null,
        visibleHeight: null,
        offset: {x: 0, y: 0},
        baseImage: null,
        tile: false
    };
    
    this.m_cOptions = extend(cDefaults, isset(cOptions) ? cOptions : {});

    this.m_cBaseImage = null;;
    this.m_cBasePattern = null;

    this.m_bLoaded = false;

    this.Anchor = new EN.Vector(0, 0);
    this.Offset = new EN.Vector(this.m_cOptions.offset.x, this.m_cOptions.offset.y);

    this.ImageWidth = 0;
    this.ImageHeight = 0;

    this.Alpha = 1;

    if (this.m_cOptions.baseImage)
    {
        this.__InitImage(this.m_cOptions.baseImage);
    }
}

inherits(ImageAsset, EN.Asset);

ImageAsset.prototype.__InitImage = function(cImage){
    this.m_cBaseImage = cImage;

    this.ImageWidth = this.m_cOptions.visibleWidth || cImage.width;
    this.ImageHeight = this.m_cOptions.visibleHeight || cImage.height;

    this.Width = this.ImageWidth;
    this.Height = this.ImageHeight;

    this.m_bLoaded = true;
};

ImageAsset.prototype.GetImage = function(){
    return this.m_cBaseImage;
};

ImageAsset.prototype.Load = function(fOnLoad){
    var self = this;
    
    EN.AssetManager.LoadImage(this.m_sFileName, function(cErr, cImage){
        if (cErr)
        {
            throw cErr;
        }
        else
        {
            self.__InitImage(cImage);

            fOnLoad();
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
        throw new Error("NOT YET IMPLEMENTED");

        //Lazy Load Required Pattern
        /*if (!this.m_cBasePattern)
        {
            this.m_cBasePattern = cRenderer.CreatePattern(this.m_cBaseImage);
        }
        
        cRenderer.DrawTiledImage(this.GlobalTransform, this.m_cBasePattern, this.Width, this.Height, this.Anchor, this.Alpha);*/
    }
    else
    {
        cRenderer.DrawImage(this);
    }
};

ImageAsset.prototype.CleanUp = function(){
    this._CleanUp_Asset();
    EN.AssetManager.ReleaseImage(this.m_sFileName);
};

EN.ImageAsset = ImageAsset;
