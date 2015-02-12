//TODO deal with update image assets without making children

include("assets/asset.js", true);
include("assets/imageasset.js", true);
include("assets/assetmanager.js", true);
include("timing/timer.js", true);

var floor = Math.floor;
var Vec = EN.Vector;
var Timer = EN.Timer;

function AnimationAsset(sFileName)
{
    //Super constructor
    this._Asset(sFileName);

    this.m_bLoaded = false;

    this.Renderable = true;

    this.CurrentFrame = 0;

    this.m_cAnimationInfo = {};
    this.m_aImages = [];

    this.m_sAnimation = "";
    this.m_cCurrentImage = null;
    this.m_cCurrentAnimation = null;
    this.m_nPreviousFramesElapsed = 0;
    this.m_bAnimationRunning = false;

    this.m_cOffset = new EN.Vector();

    var self = this;

    this.m_cOffset.OnChange(function(nNewX, nOldX, nNewY, nOldY){
        self.__OffsetChanged(nNewX, nNewY);
    });
};

inherits(AnimationAsset, EN.Asset);

Object.defineProperty(AnimationAsset.prototype, "Offset", {
    get: function(){
        return this.m_cOffset;
    },
    set: function(cOffset){
        this.m_cOffset.Set(cOffset);
    }
});

AnimationAsset.prototype.__OffsetChanged = function(x, y){
    if (this.m_cCurrentAnimation)
    {
        this.m_cCurrentImage.Pos.x = -this.m_cCurrentAnimation.width * x;
        this.m_cCurrentImage.Pos.y = -this.m_cCurrentAnimation.height * y;
    }
};

AnimationAsset.prototype.__SetFrame = function() {
    var nOffsetX = (this.CurrentFrame * this.m_cCurrentAnimation.width) % this.m_cCurrentAnimation.origWidth;
    var nOffsetY = floor((this.CurrentFrame * this.m_cCurrentAnimation.width) / this.m_cCurrentAnimation.origWidth) * this.m_cCurrentAnimation.height + this.m_cCurrentAnimation.rowOffset;

    this.m_cCurrentImage.Offset = new Vec(nOffsetX, nOffsetY);
};

AnimationAsset.prototype.Load = function(fOnLoad){
    var self = this;

    //TODO gen file name once
    EN.AssetManager.LoadFile("animations/" + this.m_sFileName + ".json", function(cErr, sSprite){
        if (!cErr)
        {
            var cSprite = JSON.parse(sSprite);

            self.m_aImages = [];

            for (var sAnimKey in cSprite.spriteSheets)
            {
                var cImage = new EN.ImageAsset(cSprite.spriteSheets[sAnimKey]);
                self.m_aImages.push(cImage);

                for (var sAnimation in cSprite.animations[sAnimKey])
                {
                    var cBaseInfo = extend({}, cSprite.baseInfo.base, cSprite.baseInfo[sAnimKey]);

                    self.m_cAnimationInfo[sAnimation] = extend({}, cBaseInfo, cSprite.animations[sAnimKey][sAnimation]);
                    self.m_cAnimationInfo[sAnimation].image = cImage;
                }
            }

            EN.Loader.Load([
                self.m_aImages
            ], function(){

                for (var sAnimation in self.m_cAnimationInfo)
                {
                    var cImage = self.m_cAnimationInfo[sAnimation].image;

                    self.m_cAnimationInfo[sAnimation].origWidth = cImage.Width;
                    self.m_cAnimationInfo[sAnimation].origHeight = cImage.Height;
                }

                self.m_bLoaded = true;
                fOnLoad();
            });
        }
        else
        {
            throw cErr;
        }
    });
};

AnimationAsset.prototype.Init = function(){
    this._Init_Asset();

    var self = this;

    this.m_aImages.forEach(function(cImage){
        cImage.Renderable = false;
        self.AddChild(cImage);
    });
};

AnimationAsset.prototype.Update = function(){
    this._Update_Asset();

    if (this.m_bAnimationRunning)
    {
        this.m_nPreviousFramesElapsed += Timer.DeltaTime / this.m_cCurrentAnimation.frameDelta;

        if (this.m_nPreviousFramesElapsed >= 1)
        {
            this.CurrentFrame = floor(this.CurrentFrame + this.m_nPreviousFramesElapsed) % this.m_cCurrentAnimation.frames;
            this.m_nPreviousFramesElapsed = this.m_nPreviousFramesElapsed - floor(this.m_nPreviousFramesElapsed);
        }

        this.__SetFrame();
    }
};

AnimationAsset.prototype.Draw = function(cRenderer){
    if (this.m_cCurrentAnimation)
    {
        cRenderer.DrawImage(this.m_cCurrentImage);
    }
};

AnimationAsset.prototype.ChangeAnimation = function(sAnimation){
    if (sAnimation != this.m_sAnimation && this.m_bLoaded)
    {
        this.m_sAnimation = sAnimation;

        this.CurrentFrame = 0;
        this.m_nPreviousFramesElapsed = 0;

        var cCurrentAnimation = this.m_cAnimationInfo[this.m_sAnimation];

        cCurrentAnimation.frameDelta = 1000 / cCurrentAnimation.fps;
        this.m_cCurrentAnimation = cCurrentAnimation;

        this.m_cCurrentImage = cCurrentAnimation.image;

        this.m_cCurrentImage.Width = this.m_cCurrentImage.ImageWidth = cCurrentAnimation.width;
        this.m_cCurrentImage.Height = this.m_cCurrentImage.ImageHeight = cCurrentAnimation.height;

        this.__OffsetChanged(this.m_cOffset.x, this.m_cOffset.y);
        this.__SetFrame();
    }
};

AnimationAsset.prototype.Reset = function(){
    this.CurrentFrame = 0;
    this.m_nPreviousFramesElapsed = 0;
};

AnimationAsset.prototype.Play = function(bPlay){
    this.m_bAnimationRunning = bPlay;
};

AnimationAsset.prototype.CleanUp = function(){
    this._CleanUp_Asset();
    EN.AssetManager.ReleaseFile("animations/" + this.m_sFileName + ".json");

    this.m_aImages.forEach(function(cImage){
        cImage.CleanUp();
    });
};

EN.AnimationAsset = AnimationAsset;
