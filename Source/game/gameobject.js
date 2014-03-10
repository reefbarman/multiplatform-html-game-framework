include("math/vector.js", true);
include("math/matrix.js", true);
include("rendering/displaylist.js", true);

var Vec = EN.Vector;
var Mat = EN.Matrix;

function GameObject()
{
    this.Pos = new Vec(0, 0);
    this.Rotation = 0;
    this.Scale = new Vec(1, 1);
    this.Width = 0;
    this.Height = 0;
    this.zIndex = 0;
    
    this.Bounds = null;
    
    this.Active = true;
    
    this.m_cTransformMatrix = new Mat();
    this.m_cScaleMatrix = new Mat();
    this.m_cTranslationMatrix = new Mat();
    this.m_cRotationMatrix = new Mat();
    
    this.m_cChildren = {};
    this.m_nChildren = 0;
}

GameObject.prototype.__CalculateTransform = function(cParentMatrix){
    this.m_cTransformMatrix.Reset()
        .Multiply(this.m_cScaleMatrix.SetScale(this.Scale))
        .Multiply(this.m_cRotationMatrix.SetRotation(this.Rotation))
        .Multiply(this.m_cTranslationMatrix.SetTranslation(this.Pos))
        .Multiply(cParentMatrix);
};

GameObject.prototype.AddChild = function(cChild){
    cChild.__ChildID = this.m_nChildren;
    this.m_cChildren[this.m_nChildren++] = cChild;
    EN.DisplayList.Add(cChild);
};

GameObject.prototype.RemoveChild = function(cChild){
    EN.DisplayList.Remove(cChild);
    delete this.m_cChildren[cChild.__ChildID];
};

GameObject.prototype.Update = function(nDt){
    for (nId in this.m_cChildren)
    {
        this.m_cChildren[nId].Update(nDt);
    }
};

GameObject.prototype.UpdateTransform = function(cParentMatrix){
    this.__CalculateTransform(cParentMatrix);
    
    for (nId in this.m_cChildren)
    {
        this.m_cChildren[nId].UpdateTransform(this.m_cTransformMatrix);
    }
};

GameObject.prototype.Draw = function(cRenderer){};

EN.GameObject = GameObject;
//# sourceURL=engine/base/gameobject.js