include("rendering/vector.js", true);

var Vec = new EN.Vector;

function GameObject()
{
    this.CoordAlignment = "TopLeft";
    this.Pos = new EN.Vector(0, 0);
    this.Width = 0;
    this.Height = 0;
}

GameObject.prototype.GetAlignedCoords = function(){
    var cCoords = null;
    
    switch (this.CoordAlignment)
    {
        case "TopLeft":
            cCoords = this.Pos;
            break;
        case "Center":
            cCoords = new Vec(this.Pos.x - this.Width / 2, this.Pos.y - this.Height / 2);
            break;
        case "BottomRight":
            cCoords = new Vec(this.Pos.x - this.Width, this.Pos.y - this.Height);
            break;
        case "BottomLeft":
            cCoords = new Vec(this.Pos.x, this.Pos.y - this.Height);
            break;
    }
    
    return cCoords;
};

EN.GameObject = GameObject;
//# sourceURL=engine/base/gameobject.js