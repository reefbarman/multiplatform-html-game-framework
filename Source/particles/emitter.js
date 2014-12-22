//TODO: Render particles to seperate buffer to avoid additive bleeding to background

include("game/gameobject.js", true);
include("math/math.js", true);
include("math/vector.js", true);
include("rendering/color.js", true);

var CM = EN.CameraManager;
var Vec = EN.Vector;

var floor = Math.floor;
var random = EN.Math.Random;
var max = Math.max;

var PI2 = Math.PI * 2;

var c_cDefaults = {
    MaxParticles: 100,
    EmissionRate: 10,
    Life: 1000,
    LifeVariance: 500,
    ParticleSpeed: 0.1,
    ParticleSpeedVariance: 0,
    StartParticleRadius: 10,
    EndParticleRadius: 10,
    Angle: 90,
    AngleVariance: 10,
    StartColor: new EN.Color(255, 0, 0, 0.2),
    EndColor: new EN.Color(255, 0, 0, 0.2),
    AdditiveColor: false,
    PosVariance: new Vec(0, 0),
    Continuous: true,
    Relative: false
};

function Emitter(cConfig)
{
    this._GameObject();
    
    this.Pos = new Vec(0, 0);
    this.Enabled = true;
    
    this.m_aParticles = [];
    this.m_nActiveParticles = 0;
    
    this.m_nEmitAccumulator = 0;
    
    this.m_cParticleTransformMatrix = new EN.Matrix();
    this.m_cDrawTransforMatrix = new EN.Matrix();
    this.m_cScaleInverseMatrix = new EN.Matrix();
    this.m_cScaleInverseMatrix.SetScale(new EN.Vector(1, -1));
    
    this.m_cOrigConfig = cConfig;
    this.Reset(cConfig);
}

inherits(Emitter, EN.GameObject);

Emitter.prototype.__Emit = function(){
    var nEmitted = 0;
    
    if (this.m_nActiveParticles < this.MaxParticles)
    {
        var cNewParticle = this.m_aParticles[this.m_nActiveParticles];
        
        var cPos = this.Relative ? new Vec() : (new Vec()).MatrixMultiply(this.m_cTransformMatrix);
        
        cNewParticle.Active = true;
        cNewParticle.Life = this.Life + random(-1, 1) * this.LifeVariance;
        cNewParticle.Speed = max(0, this.ParticleSpeed + random(-1, 1) * this.ParticleSpeedVariance);
        cNewParticle.StartRadius = this.StartParticleRadius;
        cNewParticle.EndRadius = this.EndParticleRadius;
        cNewParticle.Angle = this.Angle + random(-1, 1) * this.AngleVariance;
        
        cNewParticle.StartColor = this.StartColor;
        cNewParticle.EndColor = this.EndColor;

        cNewParticle.Pos.x = cPos.x + random(-1, 1) * this.PosVariance.x;
        cNewParticle.Pos.y = cPos.y + random(-1, 1) * this.PosVariance.y;
        
        this.m_nActiveParticles++;
        
        nEmitted = 1;
    }
    
    return nEmitted;
};

Emitter.prototype.__Recycle = function(nParticle){
    var cDeadParticle = this.m_aParticles[nParticle];
    
    if (cDeadParticle)
    {
        cDeadParticle.__Init();

        var cReplacement = this.m_aParticles[this.m_nActiveParticles - 1];
        this.m_aParticles[nParticle] = cReplacement;
        this.m_aParticles[this.m_nActiveParticles - 1] = cDeadParticle;

        this.m_nActiveParticles--;
    }
};

Emitter.prototype.Init = function(){
    for (var i = 0; i < this.MaxParticles; i++)
    {
        var cParticle = new EN.Particle();
        
        this.m_aParticles.push(cParticle);
    }
    
    EN.ParticleSystem.RegisterEmitter(this);
};

Emitter.prototype.Reset = function(cConfig){
    cConfig = extend({}, c_cDefaults, cConfig || this.m_cOrigConfig);
    
    for (var sKey in cConfig)
    {
        this[sKey] = cConfig[sKey];
    }
    
    if (this.MaxParticles > this.m_aParticles.length)
    {
        for (var i = this.m_aParticles.length; i < this.MaxParticles; i++)
        {
            var cParticle = new EN.Particle();
            this.m_aParticles.push(cParticle);
        }
    }
    else if (this.MaxParticles < this.m_aParticles.length)
    {
        this.m_nActiveParticles = Math.min(this.MaxParticles, this.m_nActiveParticles);
        this.m_aParticles = this.m_aParticles.slice(0, this.MaxParticles);
    }
    
    this.Restart();
};

Emitter.prototype.Restart = function(){
    this.m_nActiveParticles = 0;
    this.m_nEmitAccumulator = 0;
    
    this.m_aParticles.forEach(function(cParticle){
        cParticle.__Init();
    });
};

Emitter.prototype.FinalUpdate = function(nDt){
    if (this.Enabled)
    {
        this._FinalUpdate_GameObject(nDt);

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
        
        var bActive = false;
        
        for (var i = 0; i < this.m_nActiveParticles; i++)
        {
            var cParticle = this.m_aParticles[i];

            if (cParticle.Life > 0)
            {
                cParticle.Update(nDt);
                bActive = true;
            }
            else if (this.Continuous)
            {
                this.__Recycle(i);
            }
        }
        
        if (!this.Continuous && !bActive)
        {
            this.Enabled = false;
        }
    }
};

Emitter.prototype.Draw = function(cRenderer){
    var cCtx = cRenderer.GetRawContext();
    
    var cTransform = this.m_cDrawTransforMatrix;
    var cParticleTransform = this.m_cParticleTransformMatrix;
    
    cCtx.save();
        
    var cCamera = CM.GetCamera();

    if (this.AdditiveColor)
    {
        cCtx.globalCompositeOperation = "lighter";
    }
    
    for (var i = 0; i < this.m_nActiveParticles; i++)
    {
        var cParticle = this.m_aParticles[i];
        
        if (cParticle.Life > 0)
        {
            cTransform.Reset();

            if (cCamera.Cartesian)
            {
                cTransform.Multiply(this.m_cScaleInverseMatrix);
            }
            
            cParticleTransform.Reset().SetTranslation(cParticle.Pos);
            
            if (this.Relative)
            {
                cParticleTransform.Multiply(this.m_cTransformMatrix);
            }
            
            cTransform.Multiply(cParticleTransform).Multiply(EN.Game.Viewport.GetTransformMatrix()).Multiply(cCamera.GetTransformMatrix());

            cCtx.setTransform.apply(cCtx, cTransform.GetCanvasTransform());
    
            cCtx.fillStyle = cParticle.m_cColor.toString();
            cCtx.beginPath();
            cCtx.arc(0, 0, cParticle.m_nRadius, 0, PI2);
            cCtx.closePath();
            cCtx.fill();
        }
    }
    
    cCtx.globalCompositeOperation = "source-over";

    cCtx.restore();
};

Emitter.prototype.GetValues = function(){
    var cValues = {};
    
    cValues.EmissionRate = this.EmissionRate;
    cValues.MaxParticles = this.MaxParticles;
    cValues.Life = this.Life;
    cValues.LifeVariance = this.LifeVariance;
    cValues.ParticleSpeed = this.ParticleSpeed;
    cValues.PSpeedVariance = this.ParticleSpeedVariance;
    cValues.StartParticleRadius = this.StartParticleRadius;
    cValues.EndParticleRadius = this.EndParticleRadius;
    cValues.Angle = this.Angle;
    cValues.AngleVariance = this.AngleVariance;
    
    cValues.PosX = this.Pos.x;
    cValues.PosY = this.Pos.y;
    
    cValues.PosVarianceX = this.PosVariance.x;
    cValues.PosVarianceY = this.PosVariance.y;
    
    cValues.StartColor = this.StartColor.toString("rgb");
    cValues.StartColorAlpha = this.StartColor.a;
    
    cValues.EndColor = this.EndColor.toString("rgb");
    cValues.EndColorAlpha = this.EndColor.a;
    
    cValues.AdditiveColor = this.AdditiveColor;
    
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
        case "PosVarianceX":
            this.PosVariance.x = value;
            break;
        case "PosVarianceY":
            this.PosVariance.y = value;
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
                    this.m_aParticles.push(cParticle);
                }
            }
            else if (value < this.MaxParticles)
            {
                this.m_nActiveParticles = Math.min(value, this.m_nActiveParticles);
                this.m_aParticles = this.m_aParticles.slice(0, value);
            }
            
            fUpdateValue();
            break;
        case "PSpeedVariance":
            this.ParticleSpeedVariance = value;
            break;
        default:
            fUpdateValue();
            break;
    }
};

EN.Emitter = Emitter;
