include("rendering/vector.js", true);

var Vec = EN.Vector;

EN.Camera = new (function(){
    var m_nViewportWidth = 0;
    var m_nViewportHeight = 0;
    
    var m_aStates = [{
        Pos: new Vec(0, 0),
        ViewportWidth: 0,
        ViewportHeight: 0
    }];
    
    this.Pos = new Vec(0, 0);
    
    this.Init = function(){
        this.Reset();
    };
    
    this.Reset = function(){
        this.Pos = new Vec(0, 0);
        m_nViewportWidth = window.EN.device.width;
        m_nViewportHeight = window.EN.device.height; 
    };
    
    this.CheckBounds = function(cDrawable){
        var cCameraPos = new Vec(0, 0);
        var cDrawablePos = cDrawable.Pos;
        
        if (cDrawable.WorldSpace)
        {
            cCameraPos = this.Pos;
            cDrawablePos = this.WorldPosToScreenPos(cDrawablePos);
        }
        
        return !(cDrawablePos.x > cCameraPos.x + this.m_nViewportWidth || cDrawablePos.ycDrawablePos > cDrawablePos + this.m_nViewportHeight || cDrawablePos.x + cDrawable.width < cCameraPos.x || cDrawablePos.y + cDrawable.Height < cCameraPos.y) || cDrawable.IgnoreBounds;
    };
      
    this.WorldPosToScreenPos = function(cWorldPos){
        return new Vec(cWorldPos.x - this.Pos.x, cWorldPos.y - this.Pos.y);
    };
    
    this.PushState = function(cState){
        m_aStates[m_aStates.length - 1].Pos = this.Pos;
        m_aStates[m_aStates.length - 1].ViewportWidth = m_nViewportWidth;
        m_aStates[m_aStates.length - 1].ViewportHeight = m_nViewportHeight;
        
        m_aStates.push(cState);
        
        this.Pos = cState.Pos;
        m_nViewportWidth = cState.ViewportWidth;
        m_nViewportHeight = cState.ViewportHeight;
    };
    
    this.PopState = function(){
        m_aStates.pop();
        
        this.Pos = m_aStates[m_aStates.length - 1].Pos;
        m_nViewportWidth = m_aStates[m_aStates.length - 1].ViewportWidth;
        m_nViewportHeight = m_aStates[m_aStates.length - 1].ViewportHeight;
    };
    
    Object.defineProperty(this, "Viewport", {
        get: function(){
            return {
                width: m_nViewportWidth,
                height: m_nViewportHeight
            };
        },
        enumerable: true
    });
})();

//# sourceURL=engine/rendering/camera.js