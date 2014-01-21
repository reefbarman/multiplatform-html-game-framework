include("collision/collidable.js", true);

function Drawable()
{
    EN.Collidable.call(this);
    
    this.zIndex = 0;
}

inherits(Drawable, EN.Collidable);

Drawable.prototype.Draw = function(cRenderer){};

EN.Drawable = Drawable;
//# sourceURL=engine/rendering/drawable.js