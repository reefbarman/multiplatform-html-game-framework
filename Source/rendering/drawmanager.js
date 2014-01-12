include("rendering/camera.js", true);

var DrawManager = (function(){
    
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
            var cCameraPos = Camera.Pos;
            var cViewport = Camera.Viewport;
            var cCameraXMax = cCameraPos.x + cViewport.width;
            var cCameraYMax = cCameraPos.y + cViewport.height;
            
            m_aDrawables.sort(function(a, b){
                return a.zIndex - b.zIndex;
            });
            
            m_aDrawables.forEach(function(cDrawable){
                var cAABB = cDrawable.GetBounds();
                
                if (!(cAABB.x1 > cCameraXMax || cAABB.y1 > cCameraYMax || cAABB.x2 < cCameraPos.x || cAABB.y2 < cCameraPos.y))
                {
                    cDrawable.Draw(m_cRenderer);
                }
            });
        }
    };
})();

//# sourceURL=rendering/drawmanager.js