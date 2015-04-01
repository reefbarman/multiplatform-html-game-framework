//ECMAScript6

include("math/vector.js", true);
include("math/matrix.js", true);
include("rendering/displaylist.js", true);
include("game/gameobjectmanager.js", true);

var Vec = EN.Vector;
var Mat = EN.Matrix;
var Manager = EN.GameObjectManager;

class GameObject
{

    //////////////////////////////////////////////////////////
    //region Constructor

    constructor()
    {
        var self = this;

        this.ID = GameObject.__IDCount++;
        this.zIndexLocal = 0;

        this.m_bActive = true;
        this.m_bInited = false;

        this.m_nWidth = 0;
        this.m_nHeight = 0;

        this.m_cPos = new Vec(0, 0);
        this.m_cPos.OnChange(function (nNewX, nOldX, nNewY, nOldY) {
            self._PosChanged(nNewX, nOldX, nNewY, nOldY);
        });

        this.m_cScale = new Vec(1, 1);
        this.m_cScale.OnChange(function (nNewX, nOldX, nNewY, nOldY) {
            self._ScaleChanged(nNewX, nOldX, nNewY, nOldY);
        });

        this.m_nRotation = 0;

        this.m_cTransformMatrix = new Mat();

        this.m_cGlobalTransformMatrix = new Mat();
        this.m_bGlobalTransformUpdate = true;

        this.m_cParent = null;
        this.m_aChildren = [];

        this.m_bRenderable = false;
        this.__DisplayList = null;

        this.m_cBounds = null;

        Manager.RegisterGameObject(this);
    }

    //endregion

    //////////////////////////////////////////////////////////
    //region Public Accessors

    get Active()
    {
        return this.m_bActive && this.m_bInited && (!this.m_cParent || this.m_cParent.Active);
    }
    set Active(bActive)
    {
        this.m_bActive = bActive;
    }

    get Width()
    {
        return this.m_nWidth;
    }
    set Width(nWidth)
    {
        this.m_nWidth = nWidth;
    }

    get Height()
    {
        return this.m_nHeight;
    }
    set Height(nHeight)
    {
        this.m_nHeight = nHeight;
    }

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

    get Renderable()
    {
        return this.m_bRenderable;
    }
    set Renderable(bRenderable)
    {
        if (bRenderable != this.m_bRenderable)
        {
            if (bRenderable)
            {
                Manager.RegisterRenderable(this);
            }
            else
            {
                if (this.__DisplayList)
                {
                    this.__DisplayList.Remove(this);
                }

                this.__DisplayList = null;
            }
        }

        this.m_bRenderable = bRenderable;
    }

    get Bounds()
    {
        return this.m_cBounds;
    }
    set Bounds(cBounds)
    {
        this.m_cBounds = cBounds;
    }

    //endregion

    //////////////////////////////////////////////////////////
    //region Public Functions

    Init()
    {
        if (this.m_cBounds)
        {
            this.AddChild(this.m_cBounds);
        }

        this.m_bInited = true;
    }

    AddChild(cChild, bInit)
    {
        bInit = isset(bInit) ? bInit : true;

        cChild.Parent = this;
        this.m_aChildren.push(cChild);

        if (bInit)
        {
            cChild.Init();
        }
    }

    RemoveChild(cChild)
    {
        cChild.Parent = null;
        this.m_aChildren.splice(this.m_aChildren.indexOf(cChild), 1);
    }

    Update(){}
    Draw(cRenderer){}
    OnCollision(cOther){}

    Destroy()
    {
        Manager.DeregisterGameObject(this);
    }

    //endregion

    //////////////////////////////////////////////////////////
    //region Protected Functions

    _PosChanged(nNewX, nOldX, nNewY, nOldY)
    {
        if (nNewX != nOldX || nNewY != nOldY)
        {
            this.m_cTransformMatrix.Translate(new Vec(nNewX - nOldX, nNewY - nOldY));
            this.__GlobalTransformUpdate = true;
        }
    }

    _ScaleChanged(nNewX, nOldX, nNewY, nOldY)
    {
        if (nNewX != nOldX || nNewY != nOldY)
        {
            var nX = 1 / (nOldX / nNewX);
            var nY = 1 / (nOldY / nNewY);

            this.m_cTransformMatrix.Scale(new Vec(nX, nY));

            this.__GlobalTransformUpdate = true;
        }
    }

    _WidthChanged(nNewWidth, nOldWidth) {}
    _HeightChanged(nNewWidth, nOldWidth) {}

    //endregion

    //////////////////////////////////////////////////////////
    //region Private Functions

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
