include("rendering/vector.js", true);

function Entity()
{
    //Pos, Width and Height used for rendering and collision detection
    this.Pos = new Vector(0, 0);
    
    this.Width = 0;
    this.Height = 0;
}

Entity.prototype.Update = function(nDt){};

//# sourceURL=entities/entity.js