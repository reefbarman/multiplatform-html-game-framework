// http://www.flipcode.com/archives/2D_OBB_Intersection.shtml
// http://www.codezealot.org/archives/55
// http://gamedev.stackexchange.com/questions/25397/obb-vs-obb-collision-detection

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
    
    return aCorners;
};

function SATTest(cAxis, aCorners)
{
    var cMinMax = {
        min: null,
        max: null
    };
    
    for(var i = 0 ; i < aCorners.length ; i++)
    {
        var nDot = aCorners[i].Dot(cAxis);
        
        if (cMinMax.min === null || nDot < cMinMax.min)
        {
            cMinMax.min = nDot;
        }
        
        if (cMinMax.max === null || nDot > cMinMax.max)
        {
            cMinMax.max = nDot;
        }
    }
    
    return cMinMax;
}

function IsBetweenOrdered(nVal, nLowerBound, nUpperBound) 
{
    return nLowerBound <= nVal && nVal <= nUpperBound;
}

function MinMaxOverlap(cMinMax1, cMinMax2)
{
    return IsBetweenOrdered(cMinMax2.min, cMinMax1.min, cMinMax1.max) || IsBetweenOrdered(cMinMax1.min, cMinMax2.min, cMinMax2.max);
}

BoundingBox.prototype.__Overlaps = function(cBounds1, cBounds2){
    var bOverlap = true;
    
    for( var i = 0 ; i < cBounds1.Axes.length ; i++ )
    {
        var cBounds1MinMax = SATTest(cBounds1.Axes[i], cBounds1.Corners);
        var cBounds2MinMax = SATTest(cBounds1.Axes[i], cBounds2.Corners);
        
        if(!MinMaxOverlap(cBounds1MinMax, cBounds2MinMax))
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
        Axes: this.m_aAxes
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