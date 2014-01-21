include("rendering/vector.js", true);

function BoundingBox()
{
    this.Offset = new EN.Vector(0, 0);
    this.Width = 0;
    this.Height = 0;
}

BoundingBox.prototype.GetBounds = function(cPos, sAlignment){
    var nLeft = 0;
    var nTop = 0;
    
    switch (sAlignment)
    {
        case "TopLeft":
            nLeft = cPos.x + this.Offset.x;
            nTop = cPos.y + this.Offset.y;
            break;
        case "Center":
            nLeft = cPos.x + this.Offset.x - this.Width / 2;
            nTop = cPos.y + this.Offset.y - this.Height / 2;
            break;
        case "BottomRight":
            nLeft = cPos.x + this.Offset.x - this.Width;
            nTop = cPos.y + this.Offset.y - this.Height;
            break;
        case "BottomLeft":
            nLeft = cPos.x + this.Offset.x;
            nTop = cPos.y + this.Offset.y - this.Height;
            break;
    }
    
    return {
        x1: nLeft,
        y1: nTop,
        x2: nLeft + this.Width,
        y2: nTop + this.Height
    };
};

EN.BoundingBox = BoundingBox;

//# sourceURL=engine/collision/boundingbox.js