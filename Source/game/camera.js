include("math/vector.js", true);
include("math/matrix.js", true);
include("game/gameobject.js", true);

var Vec = EN.Vector;
var Mat = EN.Matrix;

function Camera(sName)
{
    this._GameObject();

    this.Name = sName;
    this.Cartesian = true;
}

inherits(Camera, EN.GameObject);

Camera.prototype.Init = function(bCartesian){
    this._Init_GameObject();

    if (isset(bCartesian))
    {
        this.Cartesian = bCartesian;
    }
    
    if (this.Cartesian)
    {
        this.m_cTransformMatrix.Scale(new Vec(1, -1));
        this.m_cTransformMatrix.Translate(new Vec(0, -EN.Device.Height));
    }
};

Camera.prototype.ConvertScreenToWorldPos = function(cScreenPos){
    var cInverse = Mat.Inverse(this.m_cTransformMatrix);
    return Vec.MatrixMultiply(cScreenPos, cInverse);
};

Camera.prototype.ConvertWorldToScreenPos = function(cWorldPos){
    return Vec.MatrixMultiply(cWorldPos, this.m_cTransformMatrix);
};

EN.Camera = Camera;
