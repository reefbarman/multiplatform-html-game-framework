// http://www.flipcode.com/archives/2D_OBB_Intersection.shtml
// http://www.codezealot.org/archives/55
// http://gamedev.stackexchange.com/questions/25397/obb-vs-obb-collision-detection

include("game/gameobject.js", true);
include("math/vector.js", true);

var cos = Math.cos;
var sin = Math.sin;

var Vec = EN.Vector;
var Mat = EN.Matrix;

var c_nDegToRadian = Math.PI / 180;

function CollisionBounds(cPos, nWidth, nHeight)
{
    this._GameObject();

    this.Pos = cPos || new Vec(0, 0);
    this.Width = nWidth || 0;
    this.Height = nHeight || 0;
    this.zIndex = 99;
    
    this.m_aCorners = [];
    this.m_aAxes = [];
    
    this.__GenerateCorners();
}

inherits(CollisionBounds, EN.GameObject);

CollisionBounds.DrawDebugBoundingBoxes = false;

CollisionBounds.TYPE_SQUARE = "square";
CollisionBounds.TYPE_CIRCLE = "circle";

CollisionBounds.prototype.__GenerateCorners = function(){
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

CollisionBounds.prototype.__CalculateCornersAxes = function(){
    var aCorners = [];
    
    for (var i = 0; i < this.m_aCorners.length; i++)
    {
        aCorners.push(Vec.MatrixMultiply(this.m_aCorners[i], this.GlobalTransform));
    }
    
    this.m_aAxes = [
        Vec.Subtract(aCorners[1], aCorners[0]),
        Vec.Subtract(aCorners[3], aCorners[0])
    ];
    
    return aCorners;
};

CollisionBounds.prototype.GetBounds = function(){
    this.__GenerateCorners();
    var aCorners = this.__CalculateCornersAxes();
    
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

CollisionBounds.prototype.__CircleAndSquareOverlaps = function(cCircle, cSquare){
    var cPos = cCircle.GlobalPos;
    var cBounds = cSquare.GetBounds();

    var nX = clamp(cPos.x, cBounds.MinMax.x1, cBounds.MinMax.x2);
    var nY = clamp(cPos.y, cBounds.MinMax.y1, cBounds.MinMax.y2);

    var cClosestPoint = new EN.Vector(nX, nY);
    var cDistance = EN.Vector.Subtract(cPos, cClosestPoint);

    var nLength = cDistance.Length();
    return nLength < cCircle.Radius;
};

CollisionBounds.prototype.CheckCollision = function(cOther){
    var bCollides = false;
    if(this.Type == CollisionBounds.TYPE_CIRCLE && cOther.Type == CollisionBounds.TYPE_SQUARE)
    {
        bCollides = this.__CircleAndSquareOverlaps(this, cOther);
    }
    else if(this.Type == CollisionBounds.TYPE_SQUARE && cOther.Type == CollisionBounds.TYPE_CIRCLE)
    {
        bCollides = this.__CircleAndSquareOverlaps(cOther, this);
    }
    
    return bCollides;
};

CollisionBounds.prototype.Draw = function(cRenderer){
    if (CollisionBounds.DrawDebugBoundingBoxes)
    {
        this.__GenerateCorners();
        cRenderer.DrawShape(this.GlobalTransform, this.m_aCorners, new EN.Color(255, 0, 0));
    }
};

function clamp(value, min, max)
{
    return Math.max(Math.min(max, value), min);
}

window.playgroundToggleBoundingBoxes = function(bEnabled){
    CollisionBounds.DrawDebugBoundingBoxes = bEnabled;
};

EN.CollisionBounds = CollisionBounds;
