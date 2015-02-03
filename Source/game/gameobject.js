include("math/vector.js", true);
include("math/matrix.js", true);
include("rendering/displaylist.js", true);

var Vec = EN.Vector;
var Mat = EN.Matrix;

function GameObject()
{
    var self = this;

    this.ID = GameObject.__IDCount++;
    this.Width = 0;
    this.Height = 0;
    this.zIndexLocal = 0;
    this.Active = true;

    this.m_cPos = new Vec(0, 0);
    this.m_cPos.OnChange(function(nNewX, nOldX, nNewY, nOldY){
        self.__PosChanged(nNewX, nOldX, nNewY, nOldY);
    });

    this.m_cScale = new Vec(1, 1);
    this.m_cScale.OnChange(function(nNewX, nOldX, nNewY, nOldY){
        self.__ScaleChanged(nNewX, nOldX, nNewY, nOldY);
    });

    this.m_nRotation = 0;
    
    this.m_cTransformMatrix = new Mat();

    this.m_cGlobalTransformMatrix = new Mat();
    this.m_bGlobalTransformUpdated = false;

    this.m_cParent = null;
    this.m_aChildren = [];

    this.Renderable = false;
    this.__DisplayList = null;
}

GameObject.__IDCount = 0;

Object.defineProperty(GameObject.prototype, "__GlobalTransformUpdated", {
    get: function(){
        return this.m_bGlobalTransformUpdated && (!this.Parent || this.Parent.__GlobalTransformUpdated);
    }
});

Object.defineProperty(GameObject.prototype, "GlobalTransform", {
    get: function(){
        if (!this.__GlobalTransformUpdated)
        {
            if (this.m_cParent)
            {
                this.m_cGlobalTransformMatrix = Mat.Multiply(this.m_cTransformMatrix, this.m_cParent.GlobalTransform);
            }
            else
            {
                this.m_cGlobalTransformMatrix = new Mat(this.m_cTransformMatrix);
            }

            this.m_bGlobalTransformUpdated = true;
        }

        return this.m_cGlobalTransformMatrix;
    }
});

Object.defineProperty(GameObject.prototype, "zIndex", {
    get: function(){
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
});

Object.defineProperty(GameObject.prototype, "Pos", {
    get: function(){
        return this.m_cPos;
    },
    set: function(cPos){
        this.m_cPos.Set(cPos);
    }
});

Object.defineProperty(GameObject.prototype, "GlobalPos", {
    get: function(){
        return this.GlobalTransform.Position;
    }
});

Object.defineProperty(GameObject.prototype, "Rotation", {
    get: function(){
        return this.m_nRotation;
    },
    set: function(nRotation){
        var nOldRot = this.m_nRotation;
        if (nOldRot != nRotation)
        {
            this.m_nRotation = nRotation;
            this.m_cTransformMatrix.Rotate(nRotation - nOldRot);
            this.m_bGlobalTransformUpdated = false;
        }
    }
});

Object.defineProperty(GameObject.prototype, "Scale", {
    get: function(){
        return this.m_cScale;
    },
    set: function(cScale){
        this.m_cScale.Set(cScale);
    }
});

Object.defineProperty(GameObject.prototype, "Parent", {
    get: function(){
        return this.m_cParent;
    },
    set: function(cParent){
        if (cParent != this.m_cParent)
        {
            this.m_cParent = cParent;
            this.m_bGlobalTransformUpdated = false;
        }
    }
});

GameObject.prototype.__PosChanged = function(nNewX, nOldX, nNewY, nOldY){
    if (nNewX != nOldX || nNewY != nOldY)
    {
        this.m_cTransformMatrix.Translate(new Vec(nNewX - nOldX, nNewY - nOldY));
        this.m_bGlobalTransformUpdated = false;
    }
};

GameObject.prototype.__ScaleChanged = function(nNewX, nOldX, nNewY, nOldY){
    if (nNewX != nOldX || nNewY != nOldY)
    {
        var nX = 1 / (nOldX / nNewX);
        var nY = 1 / (nOldY / nNewY);

        this.m_cTransformMatrix.Scale(new Vec(nX, nY));

        this.m_bGlobalTransformUpdated = false;
    }
};

GameObject.prototype.AddChild = function(cChild, bInit){
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
};

GameObject.prototype.RemoveChild = function(cChild){
    if (cChild.Renderable)
    {
        this.__DisplayList.Remove(cChild);
    }

    cChild.Parent = null;
    cChild.__DisplayList = null;
    this.m_aChildren.splice(this.m_aChildren.indexOf(cChild), 1);
};

GameObject.prototype.UpdateGameObject = function(){
    if (this.Active)
    {
        this.Update();

        this.m_aChildren.forEach(function(cChild){
            cChild.UpdateGameObject();
        });
    }
};

GameObject.prototype.Init = function(){};
GameObject.prototype.Update = function(){};
GameObject.prototype.Draw = function(cRenderer){};
GameObject.prototype.OnCollision = function(cOther){};
GameObject.prototype.CleanUp = function(){};

EN.GameObject = GameObject;
