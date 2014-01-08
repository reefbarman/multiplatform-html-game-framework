function Camera()
{
    var m_cPos = null;
    
    var m_cWorldEntity = null;
    
    function Init()
    {
        m_cPos = new Vector(0, 0);
    }
    
    Object.defineProperty(this, "Pos", {
        get: function(){
            return m_cPos;
        },
        enumerable: true
    });
    
    this.SetWorldEntity = function(cEntity){
        m_cWorldEntity = cEntity;
    };
    
    this.WorldPosToScreenPos = function(cWorldPos){
        return new Vector(cWorldPos.x - m_cPos.x, cWorldPos.y - m_cPos.y);
    };
    
    Init();
}