include("game/camera.js", true);

var Camera = EN.Camera;

EN.DrawManager = (function(){
    
    var m_aDrawables = [];
    
    var m_cRenderer = null;
    
    return {
        Init: function(cRenderer){
            m_cRenderer = cRenderer;
        },
        RegisterDrawable: function(cDrawable){
            m_aDrawables.push(cDrawable);
        },
        UnregisterDrawable: function(cDrawable){
            m_aDrawables.splice(m_aDrawables.indexOf(cDrawable), 1);
        },
        SetClearColor: function(sColor){
            m_cRenderer.SetClearColor(sColor);
        },
        Draw: function(){
            m_aDrawables.sort(function(a, b){
                return a.zIndex - b.zIndex;
            });
            
            m_aDrawables.forEach(function(cDrawable){
                if (cDrawable.Active && (Camera.CheckBounds(cDrawable) || cDrawable.IgnoreBounds))
                {
                    cDrawable.Draw(m_cRenderer);
                }
            });
        }
    };
})();

//# sourceURL=engine/rendering/drawmanager.js