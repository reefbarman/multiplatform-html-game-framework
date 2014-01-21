include("rendering/vector.js", true);
include("collision/collidable.js", true);

function Entity()
{
    EN.Collidable.call(this);
    this.ID = null;
    
    this.zIndex = 0;
    
    this.m_bInited = false;
}

inherits(Entity, EN.Collidable);

Entity.prototype.__Init = function(){
    this.m_bInited = true;
};

Entity.prototype.Update = function(nDt){
    if (!this.m_bInited)
    {
        this.__Init();
    }
};

EN.Entity = Entity;
//# sourceURL=engine/entities/entity.js