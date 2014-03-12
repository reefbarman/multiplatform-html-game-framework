// http://www.flipcode.com/archives/2D_OBB_Intersection.shtml
// http://www.codezealot.org/archives/55

include("math/vector.js", true);

var cos = Math.cos;
var sin = Math.sin;

var Vec = EN.Vector;
var Mat = EN.Matrix;

var c_nDegToRadian = Math.PI / 180;

function BoundingBox(cPos, nWidth, nHeight)
{
    this.Pos = cPos || new Vec(0, 0);
    this.Rotation = 0;
    this.Width = nWidth || 0;
    this.Height = nHeight || 0;
    this.Scale = new Vec(1, 1);
    this.zIndex = 0;
    
    this.m_cTransformMatrix = new Mat();
    this.m_cScaleMatrix = new Mat();
    this.m_cTranslationMatrix = new Mat();
    this.m_cRotationMatrix = new Mat();
    
    this.m_aCorners = [];
    this.m_aAxes = [];
    this.m_aOrigins = [];
    
    this.__GenerateCorners();
}

BoundingBox.prototype.__GenerateCorners = function(){
    var nRadians = this.Rotation * c_nDegToRadian;
        
    var cXAxis = new Vec(cos(nRadians), sin(nRadians));
    var cYAxis = new Vec(-sin(nRadians), cos(nRadians));
    
    cXAxis.ScalarMultiply(this.Width / 2);
    cYAxis.ScalarMultiply(this.Height / 2);

    this.m_aCorners = [
        Vec.Subtract(this.Pos, cXAxis).Subtract(cYAxis),
        Vec.Add(this.Pos, cXAxis).Subtract(cYAxis),
        Vec.Add(this.Pos, cXAxis).Add(cYAxis),
        Vec.Subtract(this.Pos, cXAxis).Add(cYAxis)
    ];
};

BoundingBox.prototype.__CalculateCornersAxes = function(){
    this.m_aAxes = [
        Vec.Subtract(this.m_aCorners[1], this.m_aCorners[0]),
        Vec.Subtract(this.m_aCorners[3], this.m_aCorners[0])
    ];

    this.m_aOrigins = [];

    for (var i = 0; i < 2; i++)
    {
        this.m_aAxes[i].ScalarMultiply(1 / this.m_aAxes[i].Length);
        this.m_aOrigins[0] = this.m_aCorners[0].Dot(this.m_aAxes[i]);
    }
};

BoundingBox.prototype.GetBounds = function(){
    this.__CalculateCornersAxes();
    
    var nMinX = null;
    var nMaxX = null;
    var nMinY = null;
    var nMaxY = null;

    for (var i = 0; i < this.m_aCorners.length; i++)
    {
        if (nMinX === null || this.m_aCorners[i].x < nMinX)
        {
            nMinX = this.m_aCorners[i].x;
        }

        if (nMaxX === null || this.m_aCorners[i].x > nMaxX)
        {
            nMaxX = this.m_aCorners[i].x;
        }

        if (nMinY === null || this.m_aCorners[i].y < nMinY)
        {
            nMinY = this.m_aCorners[i].y;
        }

        if (nMaxY === null || this.m_aCorners[i].y > nMaxY)
        {
            nMaxY = this.m_aCorners[i].y;
        }
    }
    
    return {
        MinMax: {
            x1: nMinX,
            x2: nMaxX,
            y1: nMinY,
            y2: nMaxY
        },
        Corners: this.m_aCorners,
        Axes: this.m_aAxes,
        Origins: this.m_aOrigins
    };
};

BoundingBox.prototype.Update = function(nDt){
    this.__GenerateCorners();
};

BoundingBox.prototype.UpdateTransform = function(cParentMatrix){
    this.m_cTransformMatrix.Reset()
        .Multiply(this.m_cScaleMatrix.SetScale(this.Scale))
        .Multiply(this.m_cRotationMatrix.SetRotation(this.Rotation))
        .Multiply(this.m_cTranslationMatrix.SetTranslation(this.Pos))
        .Multiply(cParentMatrix);
};

BoundingBox.prototype.Draw = function(cRenderer){
    cRenderer.DrawShape(this.m_cTransformMatrix, this.m_aCorners, new EN.Color(255, 0, 0));
};

EN.BoundingBox = BoundingBox;

//# sourceURL=engine/collision/boundingbox.js