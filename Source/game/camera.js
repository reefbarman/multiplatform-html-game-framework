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
    
    this.m_cInverseScale = new Vec();
    this.m_cInversePos = new Vec();
    
    this.m_cCameraInverseMatrix = new Mat();
    this.m_cInverseScaleMatrix = new Mat();
    this.m_cInverseTranslationMatrix = new Mat();
    this.m_cInverseRotationMatrix = new Mat();
    
    this.m_cTransformMatrix = new Mat();
    this.m_cScaleMatrix = new Mat();
    this.m_cTranslationMatrix = new Mat();
    this.m_cRotationMatrix = new Mat();
    
    //Below Matrix is used to flip the Y-Axis to use a cartesian coordinate system
    this.m_cAxisFlipMatrix = new EN.Matrix();
    this.m_cInverseAxisFlipMatrix = new EN.Matrix();
    
    if (isset(bCartesian))
    {
        this.Cartesian = bCartesian;
    }
    
    if (this.Cartesian)
    {
        this.m_cAxisFlipMatrix.SetScale(new EN.Vector(1, -1));
        this.m_cAxisFlipMatrix.SetTranslation(new EN.Vector(0, EN.device.height));
        
        this.m_cInverseAxisFlipMatrix.SetScale(new EN.Vector(1, -1));
        this.m_cInverseAxisFlipMatrix.SetTranslation(new EN.Vector(0, -EN.device.height));
    }
};

Camera.prototype.Update = function(nDt){
    this.m_cTransformMatrix.Reset()
        .Multiply(this.m_cScaleMatrix.SetScale(this.Scale))
        .Multiply(this.m_cRotationMatrix.SetRotation(this.Rotation))
        .Multiply(this.m_cTranslationMatrix.SetTranslation(this.Pos))
        .Multiply(this.m_cAxisFlipMatrix);

    this.m_cInverseScale.x = 1 / this.Scale.x;
    this.m_cInverseScale.y = 1 / this.Scale.y;
    
    this.m_cInversePos.x = -this.Pos.x;
    this.m_cInversePos.y = -this.Pos.y;

    this.m_cCameraInverseMatrix.Reset()
        .Multiply(this.m_cScaleMatrix.SetScale(this.m_cInverseScale))
        .Multiply(this.m_cRotationMatrix.SetRotation(-this.Rotation))
        .Multiply(this.m_cTranslationMatrix.SetTranslation(this.m_cInversePos))
        .Multiply(this.m_cInverseAxisFlipMatrix);
};

Camera.prototype.GetTransformMatrix = function(){
    return this.m_cTransformMatrix;
};

Camera.prototype.GetInverseMatrix = function(){
    return this.m_cCameraInverseMatrix;
};

EN.Camera = Camera;
//# sourceURL=engine/game/camera.js