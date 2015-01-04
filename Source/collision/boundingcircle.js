// http://www.flipcode.com/archives/2D_OBB_Intersection.shtml
// http://www.codezealot.org/archives/55
// http://gamedev.stackexchange.com/questions/25397/obb-vs-obb-collision-detection

include("collision/collisionbounds.js", true);

function BoundingCircle(nRadius)
{
    this._CollisionBounds();

    this.Radius = nRadius || 0;

    this.Type = EN.CollisionBounds.TYPE_CIRCLE;
}

inherits(BoundingCircle, EN.CollisionBounds);

BoundingCircle.prototype.CheckCollision = function(cOther){
    var bCollides = false;

    if(cOther.Type == EN.CollisionBounds.TYPE_CIRCLE)
    {
        bCollides = this.__CirclesOverlap(this, cOther) && this.__CirclesOverlap(cOther, this);
    }
    else if(cOther.Type == "square")
    {
        bCollides = this._CheckCollision_CollisionBounds(cOther);
    }

    return bCollides;
};

BoundingCircle.prototype.__CirclesOverlap = function(cBounds1, cBounds2){
    var cPos1 = cBounds1.GlobalPos;
    var cPos2 = cBounds2.GlobalPos;

    var cDist = EN.Vector.Subtract(cPos1, cPos2);

    var nLength = cDist.Length();

    if(nLength < (cBounds1.Radius + cBounds2.Radius))
    {
        return true;
    }

    return false;
};

EN.BoundingCircle = BoundingCircle;
