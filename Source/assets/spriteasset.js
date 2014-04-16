//TODO deal with update image assets without making children

include("assets/asset.js", true);
include("assets/assetmanager.js", true);
include("math/rectangle.js", true);

var Rectangle = EN.Rectangle;

function SpriteAsset(sSpriteSheetFileName, sSpriteName)
{
    //Super constructor
    EN.Asset.call(this, sSpriteSheetFileName);
    
    this.Alpha = 1;

    this.m_cVisibleRect = new Rectangle();
    this.m_cImageAreas = {};
    this.m_cBaseImage = null;
    this.m_sSpriteSheetFileName = sSpriteSheetFileName + ".json";

    this.m_sSpriteName = sSpriteName
};

inherits(SpriteAsset, EN.Asset);

SpriteAsset.prototype.Load = function(fOnLoad){
    var self = this;
    
    EN.AssetManager.LoadJSON("sprites/" + this.m_sSpriteSheetFileName, function(cErr, cSpriteData){
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



                        self.Width = self.m_cVisibleRect.Width;
                        self.Height = self.m_cVisibleRect.Height;

                        self.m_cBaseImage = cImage;
                        fOnLoad(cErr);
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
    
    cRenderer.DrawImage(
        this.m_cTransformMatrix, 
        this.m_cBaseImage, 
        this.m_cVisibleRect.Width, 
        this.m_cVisibleRect.Height, 
        new EN.Vector(this.m_cVisibleRect.X, this.m_cVisibleRect.Y),
        this.Alpha);
};

/*SpriteAsset.prototype.CleanUp = function(){
    EN.Asset.prototype.CleanUp.call(this);
    EN.AssetManager.ReleaseJSON("sprites/" + this.m_sFileName + ".json");
    
    for (var sKey in this.m_cImages)
    {
        EN.AssetManager.ReleaseImage(cSprite.dependencies["images"][sKey]);
    }
};*/

EN.SpriteAsset = SpriteAsset;
//# sourceURL=engine/assets/spriteasset.js