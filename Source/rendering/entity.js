function Entity()
{
    this.m_aChildren = [];
    
    //Pos, Width and Height used for rendering and collision detection
    this.m_cPos = new Vector(0, 0);
    this.m_nWidth = 0;
    this.m_nHeight = 0;
}

Object.defineProperty(Entity.prototype, "Pos", {
    get: function(){
        return this.m_cPos;
    },
    set: function(cPos){
        this.m_cPos = cPos;
    },
    enumerable: true
});

Entity.prototype.AddChild = function(cChild){
    this.m_aChildren.push(cChild);
};

Entity.prototype.Update = function(nDt){
    var nChildren = this.m_aChildren.length;
    
    for (var i = 0; i < nChildren; i++)
    {
        this.m_aChildren[i].Update(nDt);
    }
};

Entity.prototype.Draw = function(cRenderer){
    var nChildren = this.m_aChildren.length;
    
    for (var i = 0; i < nChildren; i++)
    {
        this.m_aChildren[i].Draw(cRenderer);
    }
};