include("rendering/drawable.js", true);
include("rendering/color.js", true);

var Vec = EN.Vector;
var Cos = Math.cos;
var Sin = Math.sin;

var c_nRadianConversionVal = Math.PI / 180;

var floor = Math.floor;

function Particle()
{
    EN.Drawable.call(this);
    
    this.__Init();
}

inherits(Particle, EN.Drawable);

Particle.prototype.__Init = function(){
    this.Active = false;
    
    this.Life = 0;
    
    this.m_nUsedLife = 0;
    
    this.m_nSpeed = 0;
    this.m_nAngle = 0;
    this.m_cVelocity = new Vec(0, 0);
    
    this.m_cStartColor = new EN.Color(255, 0, 0, 0.2);
    this.m_cEndColor = new EN.Color(255, 0, 0, 0.2);
    this.m_cColorDelta = new EN.Color(0, 0, 0, 0);
    
    this.__UpdateVelocity();
};

Particle.prototype.__UpdateVelocity = function(){
    var nRadians = this.m_nAngle * c_nRadianConversionVal;
    this.m_cVelocity.x = this.m_nSpeed * Cos(nRadians);
    this.m_cVelocity.y = -this.m_nSpeed * Sin(nRadians);
};

Object.defineProperty(Particle.prototype, "StartColor", {
    get: function(){
        return this.m_cStartColor;
    },
    set: function(cStartColor){
        this.m_cStartColor = cStartColor;
        
        this.m_cColorDelta.r = this.m_cEndColor.r - this.m_cStartColor.r;
        this.m_cColorDelta.g = this.m_cEndColor.g - this.m_cStartColor.g;
        this.m_cColorDelta.b = this.m_cEndColor.b - this.m_cStartColor.b;
        this.m_cColorDelta.a = this.m_cEndColor.a - this.m_cStartColor.a;
    }
});

Object.defineProperty(Particle.prototype, "EndColor", {
    get: function(){
        return this.m_cEndColor;
    },
    set: function(cEndColor){
        this.m_cEndColor = cEndColor;
        
        this.m_cColorDelta.r = this.m_cEndColor.r - this.m_cStartColor.r;
        this.m_cColorDelta.g = this.m_cEndColor.g - this.m_cStartColor.g;
        this.m_cColorDelta.b = this.m_cEndColor.b - this.m_cStartColor.b;
        this.m_cColorDelta.a = this.m_cEndColor.a - this.m_cStartColor.a;
    }
});

Object.defineProperty(Particle.prototype, "Speed", {
    get: function(){
        return this.m_nSpeed;
    },
    set: function(nSpeed){
        var bDifferent = this.m_nSpeed != nSpeed;
        
        this.m_nSpeed = nSpeed;
        
        if (bDifferent)
        {
            this.__UpdateVelocity();
        }
    }
});

Object.defineProperty(Particle.prototype, "Angle", {
    get: function(){
        return this.m_nAngle;
    },
    set: function(nAngle){
        var bDifferent = this.m_nAngle != nAngle;
        
        this.m_nAngle = nAngle;
        
        if (bDifferent)
        {
            this.__UpdateVelocity();
        }
    }
});

Object.defineProperty(Particle.prototype, "Radius", {
    get: function(){
        return this.m_nRadius;
    },
    set: function(nRadius){
        this.m_nRadius = nRadius;
        
        var nWidth = nRadius * 2;
        
        this.Width = nWidth;
        this.Height = nWidth;

        this.BoundingBox.Width = nWidth;
        this.BoundingBox.Height = nWidth;
    }
});

Particle.prototype.Draw = function(cRenderer){
    if (this.Life > 0)
    {
        var nLifeDelta = this.m_nUsedLife / (this.m_nUsedLife + this.Life);
        
        var cColor = new EN.Color(0, 0, 0, 0);
                
        cColor.r += floor(this.m_cStartColor.r + (this.m_cColorDelta.r * nLifeDelta));
        cColor.g += floor(this.m_cStartColor.g + (this.m_cColorDelta.g * nLifeDelta));
        cColor.b += floor(this.m_cStartColor.b + (this.m_cColorDelta.b * nLifeDelta));
        cColor.a += this.m_cStartColor.a + (this.m_cColorDelta.a * nLifeDelta);
        
        cRenderer.DrawCircle(this.Pos, this.m_nRadius, cColor);
    }
};

Particle.prototype.Update = function(nDt){
    this.Life -= nDt;
    this.m_nUsedLife += nDt;
    
    if (this.Life > 0)
    {
        this.Pos.Add(Vec.ScalarMultiply(this.m_cVelocity, nDt));
    }
};

EN.Particle = Particle;
//# sourceURL=engine/particles/particle.js