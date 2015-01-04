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
    this.zIndex = 0;
    this.Active = true;

    this.m_cPos = new Vec(0, 0);
    this.m_cPos.OnChange(function(x, y){
        self.__PosChanged(new Vec(x, y));
    });

    this.m_cScale = new Vec(1, 1);
    this.m_cScale.OnChange(function(x, y){
        self.__ScaleChanged(new Vec(x, y));
    });

    this.m_nRotation = 0;
    
    this.m_cTransformMatrix = new Mat();

    this.m_cGlobalTransformMatrix = new Mat();
    this.m_bGlobalTansformUpdated = false;

    this.m_cParent = null;
    this.m_aChildren = [];

    this.__DisplayList = null;
}

GameObject.__IDCount = 0;

Object.defineProperty(GameObject.prototype, "GlobalTransform", {
    get: function(){
        if (!this.m_bGlobalTansformUpdated)
        {
            if (this.m_cParent)
            {
                this.m_cGlobalTransformMatrix = Mat.Multiply(this.m_cTransformMatrix, this.m_cParent.GlobalTransform);
            }
            else
            {
                this.m_cGlobalTransformMatrix = new Mat(this.m_cTransformMatrix);
            }

            this.m_bGlobalTansformUpdated = true;
        }

        return this.m_cGlobalTransformMatrix;
    }
});

Object.defineProperty(GameObject.prototype, "Pos", {
    get: function(){
        return this.m_cPos;
    },
    set: function(cPos){
        var cOldPos = this.m_cPos;
        this.m_cPos = cPos;
        this.__PosChanged(Vec.Subtract(cPos, cOldPos));
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
        this.m_nRotation = nRotation;
        this.m_cTransformMatrix.Rotate(nRotation - nOldRot);
        this.m_bGlobalTansformUpdated = false;
    }
});

Object.defineProperty(GameObject.prototype, "Scale", {
    get: function(){
        return this.m_cScale;
    },
    set: function(cScale){
        var cOldScale = this.m_cScale;
        this.m_cScale = cScale;
        this.__ScaleChanged(cScale);//Vec.Subtract(cOldScale, cScale));
    }
});

Object.defineProperty(GameObject.prototype, "Parent", {
    get: function(){
        return this.m_cParent;
    },
    set: function(cParent){
        this.m_cParent = cParent;
    }
});

GameObject.prototype.__PosChanged = function(cVec){
    this.m_cTransformMatrix.Translate(cVec);
    this.m_bGlobalTansformUpdated = false;
};

GameObject.prototype.__ScaleChanged = function(cVec){
    this.m_cTransformMatrix.Scale(cVec);
    this.m_bGlobalTansformUpdated = false;
};

GameObject.prototype.AddChild = function(cChild){
    cChild.Parent = this;
    cChild.__DisplayList = this.__DisplayList;
    this.m_aChildren.push(cChild);
    this.__DisplayList.Add(cChild);
};

GameObject.prototype.RemoveChild = function(cChild){
    this.__DisplayList.Remove(cChild);
    cChild.Parent = null;
    cChild.__DisplayList = null;
    this.m_aChildren.splice(this.m_aChildren.indexOf(cChild), 1);
};

GameObject.prototype.UpdateGameObject = function(nDt){
    if (this.Active)
    {
        this.Update(nDt);

        this.m_aChildren.forEach(function(cChild){
            cChild.UpdateGameObject(nDt);
        });
    }
};

GameObject.prototype.Init = function(){};
GameObject.prototype.Update = function(nDt){};
GameObject.prototype.Draw = function(cRenderer){};
GameObject.prototype.OnCollision = function(cOther){};
GameObject.prototype.CleanUp = function(){};

EN.GameObject = GameObject;
