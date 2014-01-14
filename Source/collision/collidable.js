include("collision/boundingbox.js", true);

function Collidable()
{
    this.CoordAlignment = "TopLeft";
    this.Pos = new Vector(0, 0);
    this.Width = 0;
    this.Height = 0;
    this.Rotation = 0;
    this.BoundingBox = new BoundingBox();
}

Collidable.prototype.GetBounds = function(){
    return this.BoundingBox.GetBounds(this.Pos, this.CoordAlignment);
};

Collidable.prototype.GetAlignedCoords = function(){
    var cCoords = null;
    
    switch (this.CoordAlignment)
    {
        case "TopLeft":
            cCoords = this.Pos;
            break;
        case "Center":
            cCoords = new Vector(this.Pos.x - this.Width / 2, this.Pos.y - this.Height / 2);
            break;
        case "BottomRight":
            cCoords = new Vector(this.Pos.x - this.Width, this.Pos.y - this.Height);
            break;
        case "BottomLeft":
            cCoords = new Vector(this.Pos.x, this.Pos.y - this.Height);
            break;
    }
    
    return cCoords;
};