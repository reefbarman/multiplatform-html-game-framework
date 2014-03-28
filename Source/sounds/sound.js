function Sound(sFileName, cOptions)
{
    this.m_sFileName = sFileName;
    
    var cDefaults = {
        loop: false,
        volume: 1
    };
    
    this.m_cOptions = extend(cDefaults, cOptions);
    
    this.m_cBaseAudio = null;
    this.Playing = false;
}

Object.defineProperty(Sound.prototype, "Volume", {
    get: function(){
        var nVolume = 0;
        
        if (this.m_cBaseAudio)
        {
            nVolume = this.m_cBaseAudio.volume;
        }
        
        return nVolume;
    },
    set: function(sVolume){
        if (this.m_cBaseAudio)
        {
            this.m_cBaseAudio.volume = sVolume;
        }
    }
});

Sound.prototype.Load = function(fOnLoad){
    var self = this;
    
    EN.AssetManager.LoadAudio(this.m_sFileName + ".wav", function(cErr, cAudio){
        if (cErr)
        {
            fOnLoad(cErr);
        }
        else
        {
            self.m_cBaseAudio = cAudio;
            self.m_cBaseAudio.addEventListener("ended", function(){
                self.Playing = false;
            });
            
            self.m_cBaseAudio.loop = self.m_cOptions.loop;
            self.m_cBaseAudio.volume = self.m_cOptions.volume;
            
            fOnLoad();
        }
    });
};

Sound.prototype.Play = function(){
    if (!this.m_cBaseAudio)
    {
        throw new Error("Audio file not loaded: " + this.m_sFileName);
    }
    
    this.m_cBaseAudio.currentTime = 0;
    this.m_cBaseAudio.play();
    this.Playing = true;
};

Sound.prototype.Pause = function(){
    if (!this.m_cBaseAudio)
    {
        throw new Error("Audio file not loaded: " + this.m_sFileName);
    }
    
    this.m_cBaseAudio.pause();
    this.Playing = false;
};

Sound.prototype.CleanUp = function(){
    EN.AssetManager.ReleaseAudio(this.m_sFileName);
};

EN.Sound = Sound;
//# sourceURL=engine/sounds/sound.js