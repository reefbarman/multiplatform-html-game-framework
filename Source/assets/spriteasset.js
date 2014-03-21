//TODO deal with update image assets without making children

include("assets/asset.js", true);
include("assets/assetmanager.js", true);

var floor = Math.floor;
var Vec = EN.Vector;

function SpriteAsset(sFileName)
{
    //Super constructor
    EN.Asset.call(this, sFileName);
    
    this.m_cBaseSprite = null;
    this.m_cImages = {};
    
    this.m_sAnimation = "";
    this.m_cCurrentAnimation = null;
    this.CurrentFrame = 0;
    this.m_nPreviousFramesElapsed = 0;
    this.m_bAnimationRunning = true;
};

inherits(SpriteAsset, EN.Asset);

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
                                var cAnimation = cSprite.animations[sImageKey];

                                var cImage = new EN.ImageAsset(cSprite.dependencies[sKey][sImageKey], {
                                    visibleWidth: cAnimation.width,
                                    visibleHeight: cAnimation.height
                                });

                                self.m_cImages[sImageKey] = cImage;
                                aDependencies.push(cImage);
                            }

                            break;
                    }
                }
            }

            self.ChangeAnimation(cSprite.default);

            EN.Loader.Load(aDependencies, fOnLoad);
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

        this.m_cImages[this.m_sAnimation].Offset = new Vec(this.CurrentFrame * this.Width % this.m_cImages[this.m_sAnimation].ImageWidth, floor(this.CurrentFrame * this.Width / this.m_cImages[this.m_sAnimation].ImageWidth) * this.Height);
    }
    
    this.m_cImages[this.m_sAnimation].Pos = this.Pos;
};
    
SpriteAsset.prototype.Draw = function(cRenderer){
    EN.Asset.prototype.Draw.call(this, cRenderer);
    
    this.m_cImages[this.m_sAnimation].Draw(cRenderer);
};

SpriteAsset.prototype.ChangeAnimation = function(sAnimation){
    this.m_sAnimation = sAnimation;
    
    this.CurrentFrame = 0;
    this.m_nPreviousFramesElapsed = 0;
    
    var cCurrentAnimation = this.m_cBaseSprite.animations[this.m_sAnimation];
                
    cCurrentAnimation.frameDelta = 1000 / cCurrentAnimation.fps;
    this.m_cCurrentAnimation = cCurrentAnimation;
    
    this.m_cImages[this.m_sAnimation].CoordAlignment = this.CoordAlignment;
    
    this.Width = this.m_cCurrentAnimation.width;
    this.Height = this.m_cCurrentAnimation.height;
};

SpriteAsset.prototype.PauseAnimation = function(bPaused){
    this.m_bAnimationRunning = !bPaused;
};

SpriteAsset.prototype.CleanUp = function(){
    EN.Asset.prototype.CleanUp.call(this);
    EN.AssetManager.ReleaseJSON("sprites/" + this.m_sFileName + ".json");
};

EN.SpriteAsset = SpriteAsset;
//# sourceURL=engine/assets/spriteasset.js