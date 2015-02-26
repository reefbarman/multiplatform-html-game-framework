//ECMAScript6
// http://www.flipcode.com/archives/2D_OBB_Intersection.shtml
// http://www.codezealot.org/archives/55
// http://gamedev.stackexchange.com/questions/25397/obb-vs-obb-collision-detection

include("collision/collisionbounds.js", true);

class BoundingCircle extends EN.CollisionBounds
{
    constructor()
    {
        super(EN.CollisionBounds.TYPES.CIRCLE);

        this.m_nRadius = 0;
    }

    get Radius()
    {
        return this.m_nRadius;
    }
    set Radius(nRadius)
    {
        this.m_nRadius = nRadius;
        this.Width = nRadius * 2;
        this.Height = this.Width;
    }

    CheckCollision(cOther)
    {
        var bCollides = false;

        if(cOther.Type == this.Type)
        {
            bCollides = this.__CirclesOverlap(this, cOther) && this.__CirclesOverlap(cOther, this);
        }
        else
        {
            bCollides = super.CheckCollision(cOther);
        }

        return bCollides;
    }

    __CirclesOverlap(cBounds1, cBounds2)
    {
        var cPos1 = cBounds1.GlobalPos;
        var cPos2 = cBounds2.GlobalPos;

        var cDist = EN.Vector.Subtract(cPos1, cPos2);

        var nLength = cDist.Length();

        if(nLength < (cBounds1.Radius + cBounds2.Radius))
        {
            return true;
        }

        return false;
    }
}

EN.BoundingCircle = BoundingCircle;
