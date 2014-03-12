include("game/gameobject.js", true);
include("game/camera.js", true);

function World()
{
    EN.GameObject.call(this);
    
    //Below Matrix is used to flip the Y-Axis to use a cartesian coordinate system
    this.m_cAxisFlipMatrix = new EN.Matrix();
    this.m_cAxisFlipMatrix.SetScale(new EN.Vector(1, -1));
    this.m_cAxisFlipMatrix.SetTranslation(new EN.Vector(0, EN.device.height));
}

inherits(World, EN.GameObject);

World.prototype.__CalculateTransform = function(){
    this.m_cTransformMatrix.Reset()
        .Multiply(this.m_cScaleMatrix.SetScale(this.Scale))
        .Multiply(this.m_cAxisFlipMatrix);
};

World.prototype.Draw = function(cRenderer){
    EN.DisplayList.Draw(cRenderer);
};

EN.World = World;
//# sourceURL=engine/game/world.js