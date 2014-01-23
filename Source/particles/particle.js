include("rendering/drawable.js", true);

var Vec = EN.Vector;
var Cos = Math.cos;
var Sin = Math.sin;

var c_nRadianConversionVal = Math.PI / 180;

function Particle()
{
    EN.Drawable.call(this);
    
    this.__Init();
}

inherits(Particle, EN.Drawable);

Particle.prototype.__Init = function(){
    this.Active = false;
    
    this.Life = 0;
    
    this.m_nSpeed = 0;
    this.m_nAngle = 0;
    this.m_cVelocity = new Vec(0, 0);
    
    this.__UpdateVelocity();
};

Particle.prototype.__UpdateVelocity = function(){
    var nRadians = this.m_nAngle * c_nRadianConversionVal;
    this.m_cVelocity.x = this.m_nSpeed * Cos(nRadians);
    this.m_cVelocity.y = -this.m_nSpeed * Sin(nRadians);
};

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
        cRenderer.DrawCircle(this.Pos, 10, "rgba(255, 0, 0,  0.2)");
    }
};

Particle.prototype.Update = function(nDt){
    this.Life -= nDt;
    
    if (this.Life > 0)
    {
        this.Pos.Add(Vec.ScalarMultiply(this.m_cVelocity, nDt));
    }
};

EN.Particle = Particle;
//# sourceURL=engine/particles/particle.js