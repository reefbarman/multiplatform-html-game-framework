//ECMAScript6
// http://www.flipcode.com/archives/2D_OBB_Intersection.shtml
// http://www.codezealot.org/archives/55
// http://gamedev.stackexchange.com/questions/25397/obb-vs-obb-collision-detection

include("game/gameobject.js", true);
include("math/vector.js", true);
include("math/math.js", true);

var cos = Math.cos;
var sin = Math.sin;
var clamp = EN.Math.Clamp;

var Vec = EN.Vector;
var Mat = EN.Matrix;

var DEG_TO_RAD = Math.PI / 180;

class CollisionBounds extends EN.GameObject
{
    constructor(sType)
    {
        super();

        this.m_sType = sType;
        this.m_aCorners = [];
        this.m_aAxes = [];

        this.zIndexLocal = 99;

        this.Offset = new Vec();
    }

    get Type()
    {
        return this.m_sType;
    }

    GetBounds()
    {
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
    }

    CheckCollision(cOther)
    {
        var cCircle = this.Type == CollisionBounds.TYPES.CIRCLE ? this : cOther;
        var cBox = this.Type == CollisionBounds.TYPES.SQUARE ? this : cOther;

        return this.__CircleAndSquareOverlaps(cCircle, cBox);
    }

    Update()
    {
        super.Update();
        this.Renderable = CollisionBounds.DrawDebugBoundingBoxes;
    }

    Draw(cRenderer)
    {
        this.__GenerateCorners();

        //TODO get world scale from transform for linewidth
        cRenderer.DrawShape(this.GlobalTransform, this.m_aCorners, new EN.Color(255, 0, 0), CollisionBounds.DebugBoundsLineWidth);
    }

    __GenerateCorners()
    {
        //Previous method finding corners rotated around center
        var nRadians = 0;

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
    }

    __CalculateCornersAxes()
    {
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
    }

    __CircleAndSquareOverlaps(cCircle, cSquare)
    {
        var cPos = cCircle.GlobalPos;
        var cBounds = cSquare.GetBounds();

        var nX = clamp(cPos.x, cBounds.MinMax.x1, cBounds.MinMax.x2);
        var nY = clamp(cPos.y, cBounds.MinMax.y1, cBounds.MinMax.y2);

        var cClosestPoint = new EN.Vector(nX, nY);
        var cDistance = EN.Vector.Subtract(cPos, cClosestPoint);

        var nLength = cDistance.Length();
        return nLength < cCircle.Radius;
    }
}

CollisionBounds.DrawDebugBoundingBoxes = false;
CollisionBounds.DebugBoundsLineWidth = 0.1;

CollisionBounds.TYPES = {
    SQUARE: "square",
    CIRCLE: "circle"
};

window.playgroundToggleBoundingBoxes = function(bEnabled){
    CollisionBounds.DrawDebugBoundingBoxes = bEnabled;
};

EN.CollisionBounds = CollisionBounds;
