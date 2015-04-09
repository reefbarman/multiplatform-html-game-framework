//ECMAScript6

include("math/vector.js", true);
include("math/matrix.js", true);

var Vec = EN.Vector;
var Mat = EN.Matrix;

class Transform
{
    constructor()
    {
        this.m_cLocalPos = new Vec(0, 0);
        this.m_cLocalPos.OnChange((nNewX, nOldX, nNewY, nOldY) => {
            this.__PosChanged(nNewX, nOldX, nNewY, nOldY);
        });

        this.m_cLocalScale = new Vec(1, 1);
        this.m_cLocalScale.OnChange((nNewX, nOldX, nNewY, nOldY) => {
            this.__ScaleChanged(nNewX, nOldX, nNewY, nOldY);
        });

        this.m_nLocalRotation = 0;

        this.m_cLocalMatrix = new Mat();
        this.m_cMatrix = new Mat();

        this.m_cParentTransform = null;

        this.m_bDirty = true;
        this.m_fOnChange = function(){};
    }

    get localPosition()
    {
        return this.m_cLocalPos;
    }
    set localPosition(cPos)
    {
        this.m_cLocalPos.Set(cPos);
    }

    get position()
    {
        return this.matrix.Position;
    }

    get localScale()
    {
        return this.m_cLocalScale;
    }
    set localScale(cScale)
    {
        this.m_cLocalScale.Set(cScale);
    }

    get scale()
    {
        return this.matrix.scale;
    }

    get localRotation()
    {
        return this.m_nLocalRotation;
    }
    set localRotation(nRotation)
    {
        this.m_nLocalRotation = nRotation;
        this.SetDirty();
    }

    get rotation()
    {
        return this.matrix.rotation;
    }

    get localMatrix()
    {
        return this.m_cLocalMatrix;
    }

    get matrix()
    {
        if (this.m_bDirty)
        {
            this.__Update();
        }

        return this.m_cMatrix;
    }

    get parent()
    {
        return this.m_cParentTransform;
    }
    set parent(cParentTransform)
    {
        this.m_cParentTransform = cParentTransform;
        this.SetDirty();
    }

    OnChange(fOnChange)
    {
        this.m_fOnChange = fOnChange;
    }

    SetDirty()
    {
        this.m_bDirty = true;
        this.m_fOnChange();
    }

    __Update()
    {
        if (this.m_cParentTransform)
        {
            this.m_cMatrix = Mat.Multiply(this.m_cLocalMatrix, this.m_cParentTransform.matrix);
        }
        else
        {
            this.m_cMatrix = new Mat(this.m_cLocalMatrix);
        }

        this.m_bDirty = false;
    }

    __PosChanged(nNewX, nOldX, nNewY, nOldY)
    {
        if (nNewX != nOldX || nNewY != nOldY)
        {
            this.m_cLocalMatrix.Translate(new Vec(nNewX - nOldX, nNewY - nOldY));
            this.SetDirty();
        }
    }

    __ScaleChanged(nNewX, nOldX, nNewY, nOldY)
    {
        if (nNewX != nOldX || nNewY != nOldY)
        {
            var nX = 1 / (nOldX / nNewX);
            var nY = 1 / (nOldY / nNewY);

            this.m_cLocalMatrix.Scale(new Vec(nX, nY));
            this.SetDirty();
        }
    }
}

EN.Transform = Transform;