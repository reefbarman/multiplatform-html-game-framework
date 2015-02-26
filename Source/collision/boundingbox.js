//ECMAScript6
// http://www.flipcode.com/archives/2D_OBB_Intersection.shtml
// http://www.codezealot.org/archives/55
// http://gamedev.stackexchange.com/questions/25397/obb-vs-obb-collision-detection

include("collision/collisionbounds.js", true);
include("collision/collisionutils.js", true);

var SATTest = EN.CollisionUtils.SATTest;
var MinMaxOverlap = EN.CollisionUtils.MinMaxOverlap;

class BoundingBox extends EN.CollisionBounds
{
    constructor()
    {
        super(EN.CollisionBounds.TYPES.SQUARE);
    }

    CheckCollision(cOther)
    {
        var bCollides = false;

        if(cOther.Type == this.Type)
        {
            var cThisBounds = this.GetBounds();
            var cOtherBounds = cOther.GetBounds();

            bCollides = this.__Overlaps(cThisBounds, cOtherBounds) && this.__Overlaps(cOtherBounds, cThisBounds);
        }
        else
        {
            bCollides = super.CheckCollision(cOther);
        }

        return bCollides;
    }

    __Overlaps(cBounds1, cBounds2)
    {
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
    }
}

EN.BoundingBox = BoundingBox;
