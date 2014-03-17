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
    this.zIndex = 99;
    
    this.m_cTransformMatrix = new Mat();
    this.m_cScaleMatrix = new Mat();
    this.m_cTranslationMatrix = new Mat();
    this.m_cRotationMatrix = new Mat();
    
    this.m_aCorners = [];
    this.m_aAxes = [];
    this.m_aOrigins = [];
    
    this.__GenerateCorners();
}

BoundingBox.DrawDebugBoundingBoxes = false;

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

BoundingBox.prototype.__CalculateCornersAxes = function(cParentMatrix){
    var aCorners = [];
    
    for (var i = 0; i < this.m_aCorners.length; i++)
    {
        var cTransformMatrix = this.m_cTransformMatrix;
        
        if (cParentMatrix)
        {
            cTransformMatrix = Mat.Multiply(this.m_cTransformMatrix, cParentMatrix);
        }
        
        aCorners.push(Vec.MatrixMultiply(this.m_aCorners[i], cTransformMatrix));
    }
    
    this.m_aAxes = [
        Vec.Subtract(aCorners[1], aCorners[0]),
        Vec.Subtract(aCorners[3], aCorners[0])
    ];

    this.m_aOrigins = [];

    for (var i = 0; i < 2; i++)
    {
        this.m_aAxes[i].ScalarMultiply(1 / this.m_aAxes[i].Length());
        this.m_aOrigins[i] = aCorners[0].Dot(this.m_aAxes[i]);
    }
    
    return aCorners;
};

BoundingBox.prototype.__Overlaps = function(cBounds1, cBounds2){
    var bOverlap = true;
    
    for (var i = 0; i < 2; i++)
    {
        var t = cBounds2.Corners[0].Dot(cBounds1.Axes[i]);
        
        var tMin = t;
        var tMax = t;
        
        for (var j = 1; j < 4; j++)
        {
            t = cBounds2.Corners[j].Dot(cBounds1.Axes[i]);
            
            if (t < tMin)
            {
                tMin = t;
            }
            else  if (t > tMax)
            {
                tMax = t;
            }
        }
        
        if (tMin > (1 + cBounds1.Origins[i]) || tMax < cBounds1.Origins[i])
        {
            bOverlap = false;
            break;
        }
    }
    
    return bOverlap;
};

BoundingBox.prototype.GetBounds = function(cParentMatrix){
    this.__GenerateCorners();
    var aCorners = this.__CalculateCornersAxes(cParentMatrix);
    
    var nMinX = null;
    var nMaxX = null;
    var nMinY = null;
    var nMaxY = null;

    for (var i = 0; i < aCorners.length; i++)
    {
        if (nMinX === null || aCorners[i].x < nMinX)
        {
            nMinX = aCorners[i].x;
        }

        if (nMaxX === null || aCorners[i].x > nMaxX)
        {
            nMaxX = aCorners[i].x;
        }

        if (nMinY === null || aCorners[i].y < nMinY)
        {
            nMinY = aCorners[i].y;
        }

        if (nMaxY === null || aCorners[i].y > nMaxY)
        {
            nMaxY = aCorners[i].y;
        }
    }
    
    return {
        MinMax: {
            x1: nMinX,
            x2: nMaxX,
            y1: nMinY,
            y2: nMaxY
        },
        Corners: aCorners,
        Axes: this.m_aAxes,
        Origins: this.m_aOrigins
    };
};

BoundingBox.prototype.CheckCollision = function(cOtherBox){
    var cThisBounds = this.GetBounds();
    var cOtherBounds = cOtherBox.GetBounds();
    
    return this.__Overlaps(cThisBounds, cOtherBounds) && this.__Overlaps(cOtherBounds, cThisBounds);
};

BoundingBox.prototype.InitialUpdate = function(nDt){};
BoundingBox.prototype.FinalUpdate = function(nDt){};

BoundingBox.prototype.UpdateTransform = function(cParentMatrix){
    this.m_cTransformMatrix.Reset()
        .Multiply(this.m_cScaleMatrix.SetScale(this.Scale))
        .Multiply(this.m_cRotationMatrix.SetRotation(this.Rotation))
        .Multiply(this.m_cTranslationMatrix.SetTranslation(this.Pos))
        .Multiply(cParentMatrix);
};

BoundingBox.prototype.Draw = function(cRenderer){
    if (BoundingBox.DrawDebugBoundingBoxes)
    {
        this.__GenerateCorners();
        cRenderer.DrawShape(this.m_cTransformMatrix, this.m_aCorners, new EN.Color(255, 0, 0));
    }
};

window.playgroundToggleBoundingBoxes = function(bEnabled){
    BoundingBox.DrawDebugBoundingBoxes = bEnabled;
};

EN.BoundingBox = BoundingBox;

//# sourceURL=engine/collision/boundingbox.js