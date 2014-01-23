include("math/math.js", true);

var floor = Math.floor;
var random = EN.Math.Random;

function Emitter(cConfig)
{
    this.Pos = new EN.Vector(0, 0);
    
    var cDefaults = {
        MaxParticles: 100,
        EmissionRate: 10,
        Life: 1000,
        LifeVariance: 500,
        ParticleSpeed: 0.1,
        ParticleRadius: 20,
        Angle: 90,
        AngleVariance: 10
    };
    
    cConfig = extend(cDefaults, cConfig || {});
    
    for (var sKey in cConfig)
    {
        this[sKey] = cConfig[sKey];
    }
    
    this.m_aParticles = [];
    this.m_nActiveParticles = 0;
    
    this.m_nEmitAccumulator = 0;
}

Emitter.prototype.__Emit = function(){
    var nEmitted = 0;
    
    if (this.m_nActiveParticles < this.MaxParticles)
    {
        var cNewParticle = this.m_aParticles[this.m_nActiveParticles];
        
        cNewParticle.Active = true;
        cNewParticle.Life = this.Life + random(-1, 1) * this.LifeVariance;
        cNewParticle.Speed = this.ParticleSpeed;
        cNewParticle.Radius = this.ParticleRadius;
        cNewParticle.Angle = this.Angle + random(-1, 1) * this.AngleVariance;
        
        cNewParticle.Pos.Set(this.Pos);
        
        this.m_nActiveParticles++;
        
        nEmitted = 1;
    }
    
    return nEmitted;
};

Emitter.prototype.__Recycle = function(nParticle){
    var cDeadParticle = this.m_aParticles[nParticle];
    cDeadParticle.__Init();
    
    var cReplacement = this.m_aParticles[this.m_nActiveParticles - 1];
    this.m_aParticles[nParticle] = cReplacement;
    this.m_aParticles[this.m_nActiveParticles - 1] = cDeadParticle;
    
    this.m_nActiveParticles--;
};

Emitter.prototype.Init = function(){
    for (var i = 0; i < this.MaxParticles; i++)
    {
        var cParticle = new EN.Particle();
        
        EN.DrawManager.RegisterDrawable(cParticle);
        this.m_aParticles.push(cParticle);
    }
};

Emitter.prototype.Update = function(nDt){
    var nEmitRate = this.EmissionRate / 1000;
    
    var nParticles = 0;
    var nParticlesToEmit = this.m_nEmitAccumulator + nEmitRate * nDt;
    var nCount = floor(nParticlesToEmit);
    var nParticlesEmitted = 0;
    
    for (; nParticles < nCount; nParticles++)
    {
        nParticlesEmitted += this.__Emit();
    }
    
    this.m_nEmitAccumulator = nParticlesToEmit - nParticlesEmitted;
    
    for (var i = 0; i < this.m_nActiveParticles; i++)
    {
        var cParticle = this.m_aParticles[i];
        
        if (cParticle.Life > 0)
        {
            cParticle.Update(nDt);
        }
        else
        {
            this.__Recycle(i);
        }
    }
};

EN.Emitter = Emitter;
//# sourceURL=engine/particles/emitter.js