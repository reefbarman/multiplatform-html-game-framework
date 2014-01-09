function Camera()
{
    var self = this;
    
    var m_nViewportWidth = null;
    var m_nViewportHeight = null;
    
    var m_cWorldEntity = null;
    
    function Init()
    {
        self.Pos = new Vector(0, 0);
        
        m_nViewportWidth = window.EN.device.width;
        m_nViewportHeight = window.EN.device.height;
    }
    
    Object.defineProperty(this, "Viewport", {
        get: function(){
            return {
                width: m_nViewportWidth,
                height: m_nViewportHeight
            };
        },
        enumerable: true
    });
    
    this.SetWorldEntity = function(cEntity){
        m_cWorldEntity = cEntity;
    };
    
    this.WorldPosToScreenPos = function(cWorldPos){
        return new Vector(cWorldPos.x - this.Pos.x, cWorldPos.y - this.Pos.y);
    };
    
    Init();
}

//# sourceURL=rendering/camera.js