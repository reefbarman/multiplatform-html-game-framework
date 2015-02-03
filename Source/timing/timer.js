function Timer()
{
    this.m_bActive = true;

    this.m_nLastUpdate = 0;
    this.m_nLastDt = 0;
    this.m_nDt = 0;
    this.m_nSmoothedDt = 0;
    this.m_nStartTime = 0;
}

Object.defineProperty(Timer.prototype, "Active", {
    get: function(){
        return this.m_bActive;
    },
    set: function(bActive){
        this.m_bActive = bActive;
    }
});

Object.defineProperty(Timer.prototype, "DeltaTime", {
    get: function(){
        return this.m_nDt;
    }
});

Object.defineProperty(Timer.prototype, "DeltaTimeSeconds", {
    get: function(){
        return this.m_nDt * 0.001;
    }
})

Object.defineProperty(Timer.prototype, "DeltaTimeSmoothed", {
    get: function(){
        return this.m_nSmoothedDt;
    }
});

Object.defineProperty(Timer.prototype, "Elapsed", {
    get: function(){
        return performance.now() - this.m_nStartTime;
    }
});

Object.defineProperty(Timer.prototype, "Now", {
    get: function(){
        return performance.now();
    }
});

Timer.prototype.Init = function(){
    this.m_nStartTime = this.m_nLastUpdate = performance.now();
};

Timer.prototype.Update = function(){
    if (this.m_bActive)
    {
        var nCurrentTime = performance.now();
        this.m_nDt = nCurrentTime - this.m_nLastUpdate;
        this.m_nSmoothedDt = this.m_nDt * 0.02 + this.m_nLastDt * 0.98;

        this.m_nLastDt = this.m_nDt;
        this.m_nLastUpdate = nCurrentTime;
    }
    else
    {
        this.m_nDt = 0;
        this.m_nSmoothedDt = 0;
    }
};

EN.Timer = new Timer();