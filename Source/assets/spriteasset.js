//TODO deal with update image assets without making children

include("assets/asset.js", true);
include("assets/assetmanager.js", true);

var floor = Math.floor;
var Vec = EN.Vector;

function SpriteAsset(sFileName)
{
    //Super constructor
    EN.Asset.call(this, sFileName);
    
    this.Alpha = 1;
    
    this.m_cBaseSprite = null;
    this.m_cImages = {};
    this.m_cBaseImages = {};
    this.m_cCurrentImage = null;
    
    this.m_sAnimation = "";
    this.m_cCurrentAnimation = null;
    this.CurrentFrame = 0;
    this.m_nPreviousFramesElapsed = 0;
    this.m_bAnimationRunning = true;
};

inherits(SpriteAsset, EN.Asset);

SpriteAsset.prototype.__SetOffset = function() {
    //draw current frame straight away
    var nOffsetX = (this.CurrentFrame * this.Width) % this.m_cImages[this.m_sAnimation].ImageWidth;
    var nOffsetY = floor((this.CurrentFrame * this.Width) / this.m_cImages[this.m_sAnimation].ImageWidth) * this.Height;

    this.m_cImages[this.m_sAnimation].Offset = new Vec(nOffsetX, nOffsetY);
};

SpriteAsset.prototype.Load = function(fOnLoad){
    var self = this;
    
    EN.AssetManager.LoadJSON("sprites/" + this.m_sFileName + ".json", function(cErr, cSprite){
        if (!cErr)
        {
            self.m_cBaseSprite = cSprite;

            var aDependencies = [];

            if (isset(cSprite.dependencies))
            {
                for (var sKey in cSprite.dependencies)
                {
                    switch (sKey)
                    {
                        case "images":

                            for (var sImageKey in cSprite.dependencies[sKey])
                            {
                                self.m_cImages[sImageKey] = {
                                    Offset: new Vec(0, 0)
                                };
                                
                                var fLoadImage = (function(sImageKey, sFileName){
                                    return {
                                        Load: function(fOnLoad){
                                            EN.AssetManager.LoadImage(sFileName, function(cErr, cImage){
                                                if (!cErr)
                                                {
                                                    self.m_cImages[sImageKey].ImageWidth = cImage.width;
                                                    self.m_cImages[sImageKey].ImageHeight = cImage.height;
                                                    self.m_cBaseImages[sImageKey] = cImage;
                                                    fOnLoad();
                                                }
                                                else
                                                {
                                                    fOnload(cErr);
                                                }
                                            });
                                        }
                                    };
                                })(sImageKey, cSprite.dependencies[sKey][sImageKey]);

                                aDependencies.push(fLoadImage);
                            }

                            break;
                    }
                }
            }

            EN.Loader.Load(aDependencies, function(cErr){
                if (!cErr)
                {
                    self.ChangeAnimation(cSprite.default);
                }
                
                fOnLoad(cErr);
            });
        }
        else
        {
            fOnLoad(cErr);
        }
    });
};
    
SpriteAsset.prototype.InitialUpdate = function(nDt){
    EN.Asset.prototype.InitialUpdate.call(this, nDt);
    
    if (this.m_bAnimationRunning)
    {
        this.m_nPreviousFramesElapsed += nDt / this.m_cCurrentAnimation.frameDelta;

        if (this.m_nPreviousFramesElapsed >= 1)
        {
            this.CurrentFrame = floor(this.CurrentFrame + this.m_nPreviousFramesElapsed) % this.m_cCurrentAnimation.frames;
            this.m_nPreviousFramesElapsed = this.m_nPreviousFramesElapsed - floor(this.m_nPreviousFramesElapsed);
        }
        
        this.__SetOffset();
    }
    
    this.m_cImages[this.m_sAnimation].Pos = this.Pos;
};
    
SpriteAsset.prototype.Draw = function(cRenderer){
    EN.Asset.prototype.Draw.call(this, cRenderer);
    
    cRenderer.DrawImage(this.m_cTransformMatrix, this.m_cCurrentImage, this.Width, this.Height, this.m_cImages[this.m_sAnimation].Offset, this.Alpha);
};

SpriteAsset.prototype.ChangeAnimation = function(sAnimation){
    this.m_sAnimation = sAnimation;
    
    this.CurrentFrame = 0;
    this.m_nPreviousFramesElapsed = 0;
    
    var cCurrentAnimation = this.m_cBaseSprite.animations[this.m_sAnimation];
                
    cCurrentAnimation.frameDelta = 1000 / cCurrentAnimation.fps;
    this.m_cCurrentAnimation = cCurrentAnimation;
    
    this.m_cCurrentImage = this.m_cBaseImages[this.m_sAnimation];

    this.__SetOffset();
    
    this.Width = this.m_cCurrentAnimation.width;
    this.Height = this.m_cCurrentAnimation.height;
};

SpriteAsset.prototype.PauseAnimation = function(bPaused){
    this.m_bAnimationRunning = !bPaused;
};

SpriteAsset.prototype.CleanUp = function(){
    EN.Asset.prototype.CleanUp.call(this);
    EN.AssetManager.ReleaseJSON("sprites/" + this.m_sFileName + ".json");
    
    for (var sKey in this.m_cImages)
    {
        EN.AssetManager.ReleaseImage(cSprite.dependencies["images"][sKey]);
    }
};

EN.SpriteAsset = SpriteAsset;
//# sourceURL=engine/assets/spriteasset.js