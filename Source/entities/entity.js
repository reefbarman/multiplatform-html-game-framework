include("rendering/vector.js", true);

function Entity()
{
    this.ID = null;
    
    //Pos, Width and Height used for rendering and collision detection
    this.Pos = new Vector(0, 0);
    
    this.Width = 0;
    this.Height = 0;
    
    this.zIndex = 0;
    
    this.m_bInited = false;
}

Entity.prototype.__Init = function(){
    this.m_bInited = true;
};

Entity.prototype.Update = function(nDt){
    if (!this.m_bInited)
    {
        this.__Init();
    }
};

//# sourceURL=entities/entity.js