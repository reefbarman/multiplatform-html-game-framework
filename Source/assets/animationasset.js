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
    var self = this;

    //Super constructor
    this._Asset(sFileName);

    this.m_cAnimationInfo = null;
    this.m_cBaseImage = null;
    this.m_nOrigWidth = 0;
    this.m_nOrigHeight = 0;
    
    this.m_sAnimation = "";
    this.m_cCurrentAnimation = null;
    this.CurrentFrame = 0;
    this.m_nPreviousFramesElapsed = 0;
    this.m_bAnimationRunning = false;

    this.m_cOffset = new EN.Vector();
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
        this.m_cBaseImage.Pos.x = -this.m_cCurrentAnimation.width * x;
        this.m_cBaseImage.Pos.y = -this.m_cCurrentAnimation.height * y;
    }
};

AnimationAsset.prototype.__SetFrame = function() {
    var nOffsetX = (this.CurrentFrame * this.m_cCurrentAnimation.width) % this.m_nOrigWidth;
    var nOffsetY = floor((this.CurrentFrame * this.m_cCurrentAnimation.width) / this.m_nOrigWidth) * this.m_cCurrentAnimation.height + this.m_cCurrentAnimation.rowOffset;

    this.m_cBaseImage.Offset = new Vec(nOffsetX, nOffsetY);
};

AnimationAsset.prototype.Load = function(fOnLoad){
    var self = this;

    //TODO gen file name once
    EN.AssetManager.LoadFile("animations/" + this.m_sFileName + ".json", function(cErr, sSprite){
        if (!cErr)
        {
            var cSprite = JSON.parse(sSprite);

            for (var sAnimation in cSprite.animations)
            {
                cSprite.animations[sAnimation] = extend({}, cSprite.baseInfo, cSprite.animations[sAnimation]);
            }

            self.m_cAnimationInfo = cSprite;
            self.m_cBaseImage = new EN.ImageAsset(cSprite.spriteSheet);

            EN.Loader.Load([
                self.m_cBaseImage
            ], function(){
                self.m_nOrigWidth = self.m_cBaseImage.Width;
                self.m_nOrigHeight = self.m_cBaseImage.Height;

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

    this.AddChild(this.m_cBaseImage);
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

AnimationAsset.prototype.ChangeAnimation = function(sAnimation){
    if (sAnimation != this.m_sAnimation)
    {
        this.m_sAnimation = sAnimation;

        this.CurrentFrame = 0;
        this.m_nPreviousFramesElapsed = 0;

        var cCurrentAnimation = this.m_cAnimationInfo.animations[this.m_sAnimation];

        cCurrentAnimation.frameDelta = 1000 / cCurrentAnimation.fps;
        this.m_cCurrentAnimation = cCurrentAnimation;

        this.m_cBaseImage.Width = this.m_cBaseImage.ImageWidth = cCurrentAnimation.width;
        this.m_cBaseImage.Height = this.m_cBaseImage.ImageHeight = cCurrentAnimation.height;

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
    this.m_cBaseImage.CleanUp();
};

EN.AnimationAsset = AnimationAsset;
