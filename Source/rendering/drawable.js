include("collision/collidable.js", true);

function Drawable()
{
    EN.Collidable.call(this);
    
    this.zIndex = 0;
    this.Active = true;
    this.IgnoreBounds = false;
    this.WorldSpace = true;
    this.Rotation = 0;
}

inherits(Drawable, EN.Collidable);

Drawable.prototype.GetDrawTransform = function(){
    return {
        Pos: this.GetAlignedCoords(),
        Rotation: this.Rotation,
        Scale: this.Scale,
        WorldSpace: this.WorldSpace
    };
};

Drawable.prototype.Draw = function(cRenderer){};

EN.Drawable = Drawable;
//# sourceURL=engine/rendering/drawable.js