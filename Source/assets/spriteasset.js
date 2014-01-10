include("assets/asset.js", true);

function SpriteAsset(sFileName)
{
    //Super constructor
    Asset.call(this, sFileName);
    
    this.m_cBaseSprite = null;
    this.m_cImages = {};
    
    this.m_sAnimation = "default";
    this.m_cCurrentAnimation = null;
    this.m_nCurrentFrame = 0;
    this.m_nPreviousFramesElapsed = 0;
}

inherits(SpriteAsset, Asset);

SpriteAsset.prototype.Load = function(fOnLoad){
    var self = this;
    
    ajaxLoad({
        src: window.EN.resourcePath + "/sprites/" + self.m_sFileName + ".json",
        onComplete: function(cErr, cSprite){
            if (!cErr)
            {
                self.m_cBaseSprite = cSprite;

                var fLoadDependencies = function(){};

                if (isset(cSprite.dependencies))
                {
                    var nDependencies = 0;
                    var nLoadedDependencies = 0;

                    var fOnDependenciesLoaded = function(){
                        nLoadedDependencies++;

                        if (nLoadedDependencies >= nDependencies)
                        {
                            fOnLoad();
                        }
                    };

                    for (var sKey in cSprite.dependencies)
                    {
                        switch (sKey)
                        {
                            case "images":
                                
                                var aImages = [];
                                
                                for (var sImageKey in cSprite.dependencies[sKey])
                                {
                                    var cAnimation = cSprite.animations[sImageKey];
                                    
                                    var cImage = new ImageAsset(cSprite.dependencies[sKey][sImageKey], {
                                        visibleWidth: cAnimation.width,
                                        visibleHeight: cAnimation.height
                                    });
                                    
                                    self.m_cImages[sImageKey] = cImage;
                                    aImages.push(cImage);
                                }
                                
                                fLoadDependencies = (function(fLoadDependencies){
                                    return function(){
                                        Loader.Load(aImages, fOnDependenciesLoaded);
                                        fLoadDependencies();
                                    };
                                }(fLoadDependencies));

                                nDependencies++;
                                break;
                        }
                    }
                }
                
                var cCurrentAnimation = cSprite.animations[self.m_sAnimation];
                
                cCurrentAnimation.frameDelta = 1000 / cCurrentAnimation.fps;
                self.m_cCurrentAnimation = cCurrentAnimation;
                
                self.Width = self.m_cCurrentAnimation.width;
                self.Height = self.m_cCurrentAnimation.height;

                fLoadDependencies();
            }
            else
            {
                fOnLoad(cErr);
            }
        }
    });
};
    
SpriteAsset.prototype.Update = function(nDt){
    this.m_nPreviousFramesElapsed += nDt / this.m_cCurrentAnimation.frameDelta;

    if (this.m_nPreviousFramesElapsed >= 1)
    {
        this.m_nCurrentFrame = Math.floor(this.m_nCurrentFrame + this.m_nPreviousFramesElapsed) % this.m_cCurrentAnimation.frames;
        this.m_nPreviousFramesElapsed = this.m_nPreviousFramesElapsed - Math.floor(this.m_nPreviousFramesElapsed);
    }
    
    this.Width = this.m_cCurrentAnimation.width;
    this.Height = this.m_cCurrentAnimation.height;

    this.m_cImages[this.m_sAnimation].Pos = this.Pos;
    this.m_cImages[this.m_sAnimation].Offset = new Vector(0, this.m_nCurrentFrame * this.Width);
};
    
SpriteAsset.prototype.Draw = function(cRenderer){
    this.m_cImages[this.m_sAnimation].Draw(cRenderer);
};

//# sourceURL=assets/spriteasset.js