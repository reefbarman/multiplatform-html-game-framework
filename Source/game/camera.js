include("math/vector.js", true);
include("math/matrix.js", true);

var Vec = EN.Vector;
var Mat = EN.Matrix;

function Camera(sName)
{
    this.Pos = new Vec();
    this.Scale = new Vec(1, 1);
    this.Rotation = 0;
    this.Name = sName;
    this.Cartesian = true;
}

Camera.prototype.Init = function(bCartesian){
    this.Pos = new Vec();
    this.Scale = new Vec(1, 1);
    this.Rotation = 0;
    
    this.m_cTransformMatrix = new Mat();
    this.m_cScaleMatrix = new Mat();
    this.m_cTranslationMatrix = new Mat();
    this.m_cRotationMatrix = new Mat();
    
    //Below Matrix is used to flip the Y-Axis to use a cartesian coordinate system
    this.m_cAxisFlipMatrix = new EN.Matrix();

    if (isset(bCartesian))
    {
        this.Cartesian = bCartesian;
    }
    
    if (this.Cartesian)
    {
        this.m_cAxisFlipMatrix.SetScale(new EN.Vector(1, -1));
        this.m_cAxisFlipMatrix.SetTranslation(new EN.Vector(0, EN.Device.Height));
    }
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

Camera.prototype.GetWorldPos = function(cScreenPos){
    var cInverse = EN.Matrix.Inverse(this.m_cTransformMatrix);
    return EN.Vector.MatrixMultiply(cScreenPos, cInverse);
};

EN.Camera = Camera;
//# sourceURL=engine/game/camera.js