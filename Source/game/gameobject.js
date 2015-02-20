//ECMAScript6

include("math/vector.js", true);
include("math/matrix.js", true);
include("rendering/displaylist.js", true);

var Vec = EN.Vector;
var Mat = EN.Matrix;

class GameObject
{

    //////////////////////////////////////////////////////////
    //region Constructor

    constructor()
    {
        var self = this;

        this.ID = GameObject.__IDCount++;
        this.Width = 0;
        this.Height = 0;
        this.zIndexLocal = 0;
        this.Active = true;

        this.m_cPos = new Vec(0, 0);
        this.m_cPos.OnChange(function (nNewX, nOldX, nNewY, nOldY) {
            self.__PosChanged(nNewX, nOldX, nNewY, nOldY);
        });

        this.m_cScale = new Vec(1, 1);
        this.m_cScale.OnChange(function (nNewX, nOldX, nNewY, nOldY) {
            self.__ScaleChanged(nNewX, nOldX, nNewY, nOldY);
        });

        this.m_nRotation = 0;

        this.m_cTransformMatrix = new Mat();

        this.m_cGlobalTransformMatrix = new Mat();
        this.m_bGlobalTransformUpdate = true;

        this.m_cParent = null;
        this.m_aChildren = [];

        this.Renderable = false;
        this.__DisplayList = null;
    }

    //endregion

    //////////////////////////////////////////////////////////
    //region Public Accessors

    get GlobalTransform()
    {
        if (this.m_bGlobalTransformUpdate)
        {
            if (this.m_cParent)
            {
                this.m_cGlobalTransformMatrix = Mat.Multiply(this.m_cTransformMatrix, this.m_cParent.GlobalTransform);
            }
            else
            {
                this.m_cGlobalTransformMatrix = new Mat(this.m_cTransformMatrix);
            }

            this.m_bGlobalTransformUpdate = false;
        }

        return this.m_cGlobalTransformMatrix;
    }

    get zIndex()
    {
        var nZIndex = 0;

        if (this.m_cParent)
        {
            nZIndex = this.m_cParent.zIndex + this.zIndexLocal;
        }
        else
        {
            nZIndex = this.zIndexLocal;
        }

        return nZIndex;
    }

    get Pos()
    {
        return this.m_cPos;
    }
    set Pos(cPos)
    {
        this.m_cPos.Set(cPos);
    }

    get GlobalPos()
    {
        return this.GlobalTransform.Position;
    }

    get Rotation()
    {
        return this.m_nRotation;
    }
    set Rotation(nRotation)
    {
        var nOldRot = this.m_nRotation;
        if (nOldRot != nRotation)
        {
            this.m_nRotation = nRotation;
            this.m_cTransformMatrix.Rotate(nRotation - nOldRot);
            this.__GlobalTransformUpdate = true;
        }
    }

    get Scale()
    {
        return this.m_cScale;
    }
    set Scale(cScale)
    {
        this.m_cScale.Set(cScale);
    }

    get Parent()
    {
        return this.m_cParent;
    }
    set Parent(cParent)
    {
        if (cParent != this.m_cParent)
        {
            this.m_cParent = cParent;
            this.__GlobalTransformUpdate = true;
        }
    }

    //endregion

    //////////////////////////////////////////////////////////
    //region Public Functions

    AddChild(cChild, bInit)
    {
        bInit = isset(bInit) ? bInit : true;

        cChild.Parent = this;
        cChild.__DisplayList = this.__DisplayList;
        this.m_aChildren.push(cChild);

        if (cChild.Renderable)
        {
            this.__DisplayList.Add(cChild);
        }

        if (bInit)
        {
            cChild.Init();
        }
    }

    RemoveChild(cChild)
    {
        if (cChild.Renderable)
        {
            this.__DisplayList.Remove(cChild);
        }

        cChild.Parent = null;
        cChild.__DisplayList = null;
        this.m_aChildren.splice(this.m_aChildren.indexOf(cChild), 1);
    }

    UpdateGameObject()
    {
        if (this.Active)
        {
            this.Update();

            this.m_aChildren.forEach(function(cChild){
                cChild.UpdateGameObject();
            });
        }
    }

    Init(){}
    Update(){}
    Draw(cRenderer){}
    OnCollision(cOther){}
    CleanUp(){}

    //endregion

    //////////////////////////////////////////////////////////
    //region Private Functions

    __PosChanged(nNewX, nOldX, nNewY, nOldY)
    {
        if (nNewX != nOldX || nNewY != nOldY)
        {
            this.m_cTransformMatrix.Translate(new Vec(nNewX - nOldX, nNewY - nOldY));
            this.__GlobalTransformUpdate = true;
        }
    }

    __ScaleChanged(nNewX, nOldX, nNewY, nOldY)
    {
        if (nNewX != nOldX || nNewY != nOldY)
        {
            var nX = 1 / (nOldX / nNewX);
            var nY = 1 / (nOldY / nNewY);

            this.m_cTransformMatrix.Scale(new Vec(nX, nY));

            this.__GlobalTransformUpdate = true;
        }
    }

    set __GlobalTransformUpdate(bUpdate)
    {
        this.m_bGlobalTransformUpdate = bUpdate;

        if (bUpdate)
        {
            this.m_aChildren.forEach(function(cChild){
                cChild.__GlobalTransformUpdate = true;
            });
        }
    }

    //endregion
}

GameObject.__IDCount = 0;

EN.GameObject = GameObject;
