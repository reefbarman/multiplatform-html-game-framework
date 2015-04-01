//ECMAScript6

include("assets/asset.js", true);
include("assets/assetmanager.js", true);

class ImageAsset extends EN.Asset
{
    //////////////////////////////////////////////////////////
    //region Constructor
    constructor(sFileName, cOptions)
    {
        super(sFileName);

        this.Renderable = true;

        var cDefaults = {
            visibleWidth: null,
            visibleHeight: null,
            offset: {x: 0, y: 0},
            baseImage: null,
            tile: false
        };

        this.m_cOptions = extend(cDefaults, isset(cOptions) ? cOptions : {});

        this.m_cBaseImage = null;

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

    //endregion

    //////////////////////////////////////////////////////////
    //region Static Methods

    static Clone(cOtherImageAsset)
    {
        var cNewImageAsset = new ImageAsset(cOtherImageAsset.FileName, cOtherImageAsset.m_cOptions);
        cNewImageAsset.__InitImage(cNewImageAsset.m_cBaseImage);

        return cNewImageAsset;
    }

    //endregion

    //////////////////////////////////////////////////////////
    //region Public Methods

    GetImage()
    {
        return this.m_cBaseImage;
    }

    Load(fOnLoad)
    {
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
    }

    Draw(cRenderer)
    {
        if (!this.m_bLoaded)
        {
            throw new Error("Image Asset NOT LOADED: " + this.m_sFileName);
        }

        super.Draw(cRenderer);

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
    }

    Destroy()
    {
        super.Destroy();
        EN.AssetManager.ReleaseImage(this.m_sFileName);
    };

    //endregion

    //////////////////////////////////////////////////////////
    //region Private Methods

    __InitImage(cImage)
    {
        this.m_cBaseImage = cImage;

        this.ImageWidth = this.m_cOptions.visibleWidth || cImage.width;
        this.ImageHeight = this.m_cOptions.visibleHeight || cImage.height;

        this.Width = this.ImageWidth;
        this.Height = this.ImageHeight;

        this.m_bLoaded = true;
    }

    //endregion
}

EN.ImageAsset = ImageAsset;
