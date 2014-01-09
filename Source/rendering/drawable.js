function Drawable()
{
    this.zIndex = 0;
    this.Pos = new Vector(0, 0);
    this.Width = 0;
    this.Height = 0;
}

Drawable.prototype.Draw = function(cRenderer){};