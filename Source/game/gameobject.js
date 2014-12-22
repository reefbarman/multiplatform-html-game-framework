include("math/vector.js", true);
include("math/matrix.js", true);
include("rendering/displaylist.js", true);

var Vec = EN.Vector;
var Mat = EN.Matrix;

function GameObject()
{
    this.ID = GameObject.__IDCount++;
    this.Pos = new Vec(0, 0);
    this.Rotation = 0;
    this.Scale = new Vec(1, 1);
    this.Width = 0;
    this.Height = 0;
    this.zIndex = 0;
    this.Active = true;
    
    this.m_cTransformMatrix = new Mat();
    this.m_cScaleMatrix = new Mat();
    this.m_cTranslationMatrix = new Mat();
    this.m_cRotationMatrix = new Mat();
    
    this.m_cChildren = {};
    this.m_nChildren = 0;
    
    this.m_nPreviousRotation = 0;

    this.__DisplayList = null;
}

GameObject.__IDCount = 0;

GameObject.prototype.__CalculateTransform = function(cParentMatrix){
    this.m_cTransformMatrix.Reset().Multiply(this.m_cScaleMatrix.SetScale(this.Scale));
    
    if (this.Rotation != this.m_nPreviousRotation)
    {
        this.m_cRotationMatrix.SetRotation(this.Rotation);
        this.m_nPreviousRotation = this.Rotation;
    }
    
    this.m_cTransformMatrix.Multiply(this.m_cRotationMatrix).Multiply(this.m_cTranslationMatrix.SetTranslation(this.Pos));

    if (cParentMatrix)
    {
        this.m_cTransformMatrix.Multiply(cParentMatrix);
    }
};

GameObject.prototype.Init = function(){
};

GameObject.prototype.GetDisplayList = function(){
    return this.__DisplayList;
};

GameObject.prototype.AddChild = function(cChild){
    cChild.__ChildID = this.m_nChildren;
    cChild.__Parent = this;
    cChild.__DisplayList = this.__DisplayList;
    this.m_cChildren[this.m_nChildren++] = cChild;
    
    this.__DisplayList.Add(cChild);
};

GameObject.prototype.RemoveChild = function(cChild){
    this.__DisplayList.Remove(cChild);
    cChild.__Parent = null;
    cChild.__DisplayList = null;
    delete this.m_cChildren[cChild.__ChildID];
};

GameObject.prototype.UpdateGameObject = function(nDt){
    if (this.Active)
    {
        for (var nId in this.m_cChildren)
        {
            this.m_cChildren[nId].UpdateGameObject(nDt);
        }

        this.Update(nDt);
    }
};

GameObject.prototype.UpdateTransform = function(cParentMatrix){
    if (this.Active)
    {
        this.__CalculateTransform(cParentMatrix);

        for (var nId in this.m_cChildren)
        {
            this.m_cChildren[nId].UpdateTransform(this.m_cTransformMatrix);
        }
    }
};

GameObject.prototype.Update = function(nDt){};
GameObject.prototype.Draw = function(cRenderer){};
GameObject.prototype.OnCollision = function(cOther){};

GameObject.prototype.CleanUp = function(){
};

EN.GameObject = GameObject;
//# sourceURL=engine/base/gameobject.js