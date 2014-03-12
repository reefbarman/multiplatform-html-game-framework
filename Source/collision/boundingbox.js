// http://www.flipcode.com/archives/2D_OBB_Intersection.shtml
// http://www.codezealot.org/archives/55

include("math/vector.js", true);

var cos = Math.cos;
var sin = Math.sin;

var Vec = EN.Vector;

var c_nDegToRadian = Math.PI / 180;

function BoundingBox(cPos, nWidth, nHeight)
{
    this.m_cPos = cPos || new Vec(0, 0);
    this.m_nRotation = 0;
    this.m_nWidth = nWidth || 0;
    this.m_nHeight = nHeight || 0;
    
    this.m_bModified = true;
    
    this.m_aCorners = [];
    this.m_aAxes = [];
}

Object.defineProperty(BoundingBox.prototype, "Pos", {
    get: function(){
        return this.m_cPos;
    },
    set: function(cPos){
        this.m_cPos = cPos;
        this.m_bModified = true;
    }
});

Object.defineProperty(BoundingBox.prototype, "Rotation", {
    get: function(){
        return this.m_nRotation;
    },
    set: function(nRotation){
        this.m_nRotation = nRotation;
        this.m_bModified = true;
    }
});

Object.defineProperty(BoundingBox.prototype, "Width", {
    get: function(){
        return this.m_nWidth;
    },
    set: function(nWidth){
        this.m_nWidth = nWidth;
        this.m_bModified = true;
    }
});

Object.defineProperty(BoundingBox.prototype, "Height", {
    get: function(){
        return this.m_nHeight;
    },
    set: function(nHeight){
        this.m_nHeight = nHeight;
        this.m_bModified = true;
    }
});

BoundingBox.prototype.__CalculateCornersAxes = function(){
    if (this.m_bModified)
    {
        var nRadians = this.Rotation * c_nDegToRadian;
        
        var cXAxis = new Vec(cos(nRadians), sin(nRadians));
        var cYAxis = new Vec(-sin(nRadians), cos(nRadians));
        
        this.m_aCorners = [
            Vec.Subtract(this.m_cPos, cXAxis).Subtract(cYAxis),
            Vec.Add(this.m_cPos, cXAxis).Subtract(cYAxis),
            Vec.Add(this.m_cPos, cXAxis).Add(cYAxis),
            Vec.Subtract(this.m_cPos, cXAxis).Add(cYAxis)
        ];
        
        this.m_aAxes = [
            Vec.Subtract(this.m_aCorners[1], this.m_aCorners[0]),
            Vec.Subtract(this.m_aCorners[3], this.m_aCorners[0])
        ];
        
        this.m_aOrigins = [];
        
        for (var i = 0; i < 2; i++)
        {
            this.m_aAxes[i].ScalarMultiply(1 / this.m_aAxes[i].Length);
            this.m_aOrigins[0] = this.m_aCorners[0].dot(this.m_aAxes[i]);
        }
        
        this.m_bModified = false;
    }
};

BoundingBox.prototype.GetBounds = function(){
    return {
        Corners: this.m_aCorners,
        Axes: this.m_aAxes,
        Origins: this.m_aOrigins
    };
};

EN.BoundingBox = BoundingBox;

//# sourceURL=engine/collision/boundingbox.js