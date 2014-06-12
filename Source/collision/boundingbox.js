// http://www.flipcode.com/archives/2D_OBB_Intersection.shtml
// http://www.codezealot.org/archives/55
// http://gamedev.stackexchange.com/questions/25397/obb-vs-obb-collision-detection

include("collision/collisionbounds.js", true);

function BoundingBox()
{
    this._CollisionBounds();

    this.Type = EN.CollisionBounds.TYPE_SQUARE;
}

inherits(BoundingBox, EN.CollisionBounds);

BoundingBox.prototype.CheckCollision = function(cOther){
    var cThisBounds = this.GetBounds();
    var cOtherBounds = cOther.GetBounds();

    var bCollides = false;

    if(cOther.Type == EN.CollisionBounds.TYPE_SQUARE)
    {
        bCollides = this.__Overlaps(cThisBounds, cOtherBounds) && this.__Overlaps(cOtherBounds, cThisBounds);
    }
    else if(cOther.Type == EN.CollisionBounds.TYPE_CIRCLE)
    {
        bCollides = this._CheckCollision_CollisionBounds(cOther);
    }

    return bCollides;
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

EN.BoundingBox = BoundingBox;

//# sourceURL=engine/collision/boundingbox.js