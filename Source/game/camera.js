include("math/vector.js", true);
include("math/matrix.js", true);

var Vec = EN.Vector;
var Mat = EN.Matrix;

function Camera()
{
    this.Pos = new Vec();
    this.Scale = new Vec(1, 1);
    this.Rotation = 0;
    
    this.m_cTransformMatrix = new Mat();
    this.m_cScaleMatrix = new Mat();
    this.m_cTranslationMatrix = new Mat();
    this.m_cRotationMatrix = new Mat();
    
    //Below Matrix is used to flip the Y-Axis to use a cartesian coordinate system
    this.m_cAxisFlipMatrix = new EN.Matrix();
}

Camera.prototype.Init = function(){
    this.m_cAxisFlipMatrix.SetScale(new EN.Vector(1, -1));
    this.m_cAxisFlipMatrix.SetTranslation(new EN.Vector(0, EN.device.height));
};

Camera.prototype.Update = function(nDt){
    this.m_cTransformMatrix.Reset()
        .Multiply(this.m_cScaleMatrix.SetScale(this.Scale))
        .Multiply(this.m_cRotationMatrix.SetRotation(this.Rotation))
        .Multiply(this.m_cTranslationMatrix.SetTranslation(this.Pos))
        .Multiply(this.m_cAxisFlipMatrix);
};

Camera.prototype.GetTransformMatrix = function(){
    return this.m_cTransformMatrix;
};

EN.Camera = new Camera();
//# sourceURL=engine/game/camera.js