//ECMAScript6

include("math/vector.js", true);
include("math/matrix.js", true);
include("game/gameobject.js", true);

var Vec = EN.Vector;
var Mat = EN.Matrix;

class Camera extends EN.GameObject
{
    constructor(sName)
    {
        super();

        this.Name = sName;
        this.Cartesian = true;
    }

    Init(nViewPortHeight, bCartesian)
    {
        super.Init();

        if (isset(bCartesian))
        {
            this.Cartesian = bCartesian;
        }

        if (this.Cartesian)
        {
            this.transform.localMatrix.Scale(new Vec(1, -1));
            this.transform.localMatrix.Translate(new Vec(0, -nViewPortHeight));
        }
    }

    ConvertScreenToWorldPos(cScreenPos)
    {
        var cInverse = Mat.Inverse(this.transform.localMatrix);
        return Vec.MatrixMultiply(cScreenPos, cInverse);
    }

    ConvertWorldToScreenPos(cWorldPos)
    {
        return Vec.MatrixMultiply(cWorldPos, this.transform.localMatrix);
    }
}

EN.Camera = Camera;
