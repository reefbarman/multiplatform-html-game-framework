function Collidable()
{
    this.CoordAlignment = "TopLeft";
    this.Pos = new Vector(0, 0);
    this.Width = 0;
    this.Height = 0;
    this.Rotation = 0;
}

Collidable.prototype.GetBounds = function(){
    var cAABB = {};
    
    switch (this.CoordAlignment)
    {
        case "TopLeft":
            cAABB = {
                x1: this.Pos.x,
                y1: this.Pos.y,
                x2: this.Pos.x + this.Width,
                x3: this.Pos.y + this.Height
            };
            break;
        case "Center":
            cAABB = {
                x1: this.Pos.x - this.Width / 2,
                y1: this.Pos.y - this.Height / 2,
                x2: this.Pos.x + this.Width / 2,
                y2: this.Pos.y + this.Height / 2
            };
            break;
    }
    
    return cAABB;
};