include("rendering/vector.js", true);
include("base/gameobject.js", true);
include("collision/boundingbox.js", true);

function Entity()
{
    EN.GameObject.call(this);
    this.ID = null;
    
    this.zIndex = 0;
    
    this.m_bInited = false;
    this.BoundBox = new EN.BoundingBox();
}

inherits(Entity, EN.GameObject);

Entity.prototype.__Init = function(){
    this.m_bInited = true;
};

Entity.prototype.GetBounds = function(){
    return this.BoundingBox.GetBounds(this.Pos, this.CoordAlignment);
};

Entity.prototype.Update = function(nDt){
    if (!this.m_bInited)
    {
        this.__Init();
    }
};

EN.Entity = Entity;
//# sourceURL=engine/entities/entity.js