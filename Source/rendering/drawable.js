include("collision/collidable.js", true);

function Drawable()
{
    Collidable.call(this);
    
    this.zIndex = 0;
}

inherits(Drawable, Collidable);

Drawable.prototype.Draw = function(cRenderer){};