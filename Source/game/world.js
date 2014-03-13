include("game/gameobject.js", true);
include("game/camera.js", true);

function World()
{
    EN.GameObject.call(this);
}

inherits(World, EN.GameObject);

World.prototype.__CalculateTransform = function(){};

World.prototype.Draw = function(cRenderer){
    EN.DisplayList.Draw(cRenderer);
};

EN.World = World;
//# sourceURL=engine/game/world.js