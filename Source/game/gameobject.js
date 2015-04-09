//ECMAScript6

include("math/vector.js", true);
include("math/matrix.js", true);
include("rendering/displaylist.js", true);
include("game/gameobjectmanager.js", true);
include("game/transform.js", true);

var Vec = EN.Vector;
var Manager = EN.GameObjectManager;

class GameObject
{

    //////////////////////////////////////////////////////////
    //region Constructor

    constructor()
    {
        this.ID = GameObject.__IDCount++;
        this.zIndexLocal = 0;

        this.m_bActive = true;
        this.m_bInited = false;

        this.m_nWidth = 0;
        this.m_nHeight = 0;

        this.m_cTransform = new EN.Transform();
        this.m_cTransform.OnChange(() => {
            this.__OnTransformUpdate();
        });

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

    get transform()
    {
        return this.m_cTransform;
    }

    get GlobalTransform()
    {
        return this.m_cTransform.matrix;
    }

    get Pos()
    {
        return this.m_cTransform.localPosition;
    }
    set Pos(cPos)
    {
        this.m_cTransform.localPosition = cPos;
    }

    get GlobalPos()
    {
        return this.m_cTransform.position;
    }

    get Rotation()
    {
        return this.m_cTransform.localRotation;
    }
    set Rotation(nRotation)
    {
        this.m_cTransform.localRotation = nRotation;
    }

    get Scale()
    {
        return this.m_cTransform.scale;
    }
    set Scale(cScale)
    {
        this.m_cTransform.localScale = cScale;
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
            this.m_cTransform.parent = cParent ? cParent.transform : null;
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
    //region Private Functions

    __OnTransformUpdate()
    {
        this.m_aChildren.forEach(function(cChild){
            cChild.transform.SetDirty();
        });
    }

    //endregion
}

GameObject.__IDCount = 0;

EN.GameObject = GameObject;
