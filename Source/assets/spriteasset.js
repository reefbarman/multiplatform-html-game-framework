//TODO deal with update image assets without making children

include("assets/asset.js", true);
include("assets/assetmanager.js", true);
include("math/rectangle.js", true);

var Rectangle = EN.Rectangle;

function SpriteAsset(sSpriteSheetFileName, sSpriteName, cOptions)
{
    //Super constructor
    EN.Asset.call(this, sSpriteSheetFileName);

    var cDefaults = {        
        visibleWidth: null,
        visibleHeight: null,
        tile: false
    };

    this.m_cOptions = extend(cDefaults, isset(cOptions) ? cOptions : {});
    
    this.Alpha = 1;

    this.m_cVisibleRect = new Rectangle();
    this.m_cBaseImage = null;
    this.m_cBasePattern = null;
    this.m_sSpriteSheetFileName = "sprites/" + sSpriteSheetFileName + ".json";

    this.Offset = new EN.Vector(0, 0);

    this.m_sSpriteName = sSpriteName;
};

inherits(SpriteAsset, EN.Asset);

SpriteAsset.prototype.Load = function(fOnLoad){
    var self = this;
    
    EN.AssetManager.LoadJSON(this.m_sSpriteSheetFileName, function(cErr, cSpriteData){
        if (!cErr)
        {
            if(isset(cSpriteData.image))
            {
                EN.AssetManager.LoadImage(cSpriteData.image, function(cErr, cImage){
                    if(isset(cSpriteData.sprites) && isset(cSpriteData.sprites[self.m_sSpriteName]))
                    {
                        var cImageData = cSpriteData.sprites[self.m_sSpriteName];

                        self.m_cVisibleRect = new Rectangle(cImageData.rect.x, 
                            cImageData.rect.y, 
                            cImageData.rect.w, 
                            cImageData.rect.h
                        );

                        self.Width = self.m_cOptions.visibleWidth || self.m_cVisibleRect.Width;
                        self.Height = self.m_cOptions.visibleHeight || self.m_cVisibleRect.Height;

                        self.m_cBaseImage = cImage;
                        fOnLoad(cErr);
                    }
                    else
                    {
                        throw new Error(self.m_sSpriteName + "sprite name does not exist in " + self.m_sSpriteSheetFileName);
                    }             
                });
            }
        }
        else
        {
            fOnLoad(cErr);
        }
    });
};
    
SpriteAsset.prototype.Draw = function(cRenderer){
    EN.Asset.prototype.Draw.call(this, cRenderer);

    if (this.m_cOptions.tile)
    {
        if (!this.m_cBasePattern)
        {
            this.m_cBasePattern = cRenderer.CreatePattern(this.m_cBaseImage);
        }

        var cOffset = new EN.Vector(this.m_cVisibleRect.X, this.m_cVisibleRect.Y);
        cOffset.Add(this.Offset);
        
        cRenderer.DrawTiledImage(
            this.m_cTransformMatrix, 
            this.m_cBasePattern,
            this.Width, 
            this.Height, 
            cOffset, 
            this.Alpha
        );
    }
    else
    {
        cRenderer.DrawImage(
            this.m_cTransformMatrix, 
            this.m_cBaseImage, 
            this.Width, 
            this.Height, 
            new EN.Vector(this.m_cVisibleRect.X, this.m_cVisibleRect.Y),
            this.Alpha);
    }
};

SpriteAsset.prototype.CleanUp = function(){
    EN.Asset.prototype.CleanUp.call(this);
};

EN.SpriteAsset = SpriteAsset;
//# sourceURL=engine/assets/spriteasset.js