include("math/math.js", true);
include("rendering/color.js", true);

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
        ParticleRadius: 10,
        Angle: 90,
        AngleVariance: 10,
        StartColor: new EN.Color(255, 0, 0, 0.2),
        EndColor: new EN.Color(255, 0, 0, 0.2)
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
        
        cNewParticle.StartColor = this.StartColor;
        cNewParticle.EndColor = this.EndColor;
        
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

Emitter.prototype.GetValues = function(){
    var cValues = {};
    
    cValues.EmissionRate = this.EmissionRate;
    cValues.MaxParticles = this.MaxParticles;
    cValues.Life = this.Life;
    cValues.LifeVariance = this.LifeVariance;
    cValues.ParticleSpeed = this.ParticleSpeed;
    cValues.ParticleRadius = this.ParticleRadius;
    cValues.Angle = this.Angle;
    cValues.AngleVariance = this.AngleVariance;
    
    cValues.PosX = this.Pos.x;
    cValues.PosY = this.Pos.y;
    
    cValues.StartColor = this.StartColor.toString("rgb");
    cValues.StartColorAlpha = this.StartColor.a;
    
    cValues.EndColor = this.EndColor.toString("rgb");
    cValues.EndColorAlpha = this.EndColor.a;
    
    return cValues;
};

Emitter.prototype.UpdateValue = function(sValue, value){
    var self = this;
    
    var fUpdateValue = function(){
        if (isset(self[sValue]))
        {
            self[sValue] = value;
        }
    };
    
    switch(sValue)
    {
        case "StartColor":
            this.StartColor.SetHex(value);
            break;
        case "StartColorAlpha":
            this.StartColor.a = value;
            break;
        case "EndColor":
            this.EndColor.SetHex(value);
            break;
        case "EndColorAlpha":
            this.EndColor.a = value;
            break;
        case "PosX":
            this.Pos.x = value;
            break;
        case "PosY":
            this.Pos.y = value;
            break;
        case "EmissionRate":
            this.m_nEmitAccumulator = 0;
            fUpdateValue();
            break;
        case "MaxParticles":
            if (value > this.MaxParticles)
            {
                for (var i = this.MaxParticles; i < value; i++)
                {
                    var cParticle = new EN.Particle();

                    EN.DrawManager.RegisterDrawable(cParticle);
                    this.m_aParticles.push(cParticle);
                }
            }
            else if (value < this.MaxParticles)
            {
                this.m_nActiveParticles = Math.min(value, this.m_nActiveParticles);
                
                for (var i = value; i < this.MaxParticles; i++)
                {
                    var cParticle = this.m_aParticles[i];

                    EN.DrawManager.UnregisterDrawable(cParticle);
                }
                
                this.m_aParticles = this.m_aParticles.slice(0, value);
            }
            
            fUpdateValue();
            break;
        default:
            fUpdateValue();
            break;
    }
};

EN.Emitter = Emitter;
//# sourceURL=engine/particles/emitter.js