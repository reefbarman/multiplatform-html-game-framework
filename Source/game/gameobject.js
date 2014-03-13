include("math/vector.js", true);
include("math/matrix.js", true);
include("rendering/displaylist.js", true);
include("collision/boundingbox.js", true);

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
    
    this.Bounds = new EN.BoundingBox();
    
    this.Active = true;
    
    this.m_cTransformMatrix = new Mat();
    this.m_cScaleMatrix = new Mat();
    this.m_cTranslationMatrix = new Mat();
    this.m_cRotationMatrix = new Mat();
    
    this.m_cChildren = {};
    this.m_nChildren = 0;
    
    //this.AddChild(this.Bounds);
}

GameObject.__IDCount = 0;

GameObject.prototype.__CalculateTransform = function(cParentMatrix){
    this.m_cTransformMatrix.Reset()
        .Multiply(this.m_cScaleMatrix.SetScale(this.Scale))
        .Multiply(this.m_cRotationMatrix.SetRotation(this.Rotation))
        .Multiply(this.m_cTranslationMatrix.SetTranslation(this.Pos))
        .Multiply(cParentMatrix);
};

GameObject.prototype.AddChild = function(cChild){
    cChild.__ChildID = this.m_nChildren;
    cChild.__Parent = this;
    this.m_cChildren[this.m_nChildren++] = cChild;
    EN.DisplayList.Add(cChild);
};

GameObject.prototype.RemoveChild = function(cChild){
    EN.DisplayList.Remove(cChild);
    cChild.__Parent = null;
    delete this.m_cChildren[cChild.__ChildID];
};

GameObject.prototype.InitialUpdate = function(nDt){
    for (var nId in this.m_cChildren)
    {
        this.m_cChildren[nId].InitialUpdate(nDt);
    }
};

GameObject.prototype.UpdateTransform = function(cParentMatrix){
    this.__CalculateTransform(cParentMatrix);
    
    for (var nId in this.m_cChildren)
    {
        this.m_cChildren[nId].UpdateTransform(this.m_cTransformMatrix);
    }
};

GameObject.prototype.FinalUpdate = function(nDt){
    for (var nId in this.m_cChildren)
    {
        this.m_cChildren[nId].FinalUpdate(nDt);
    }
};

GameObject.prototype.Draw = function(cRenderer){};

GameObject.prototype.OnCollision = function(cOther){};

EN.GameObject = GameObject;
//# sourceURL=engine/base/gameobject.js