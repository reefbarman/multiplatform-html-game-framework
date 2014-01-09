include("rendering/camera.js", true);

var DrawManager = (function(){
    
    var m_aDrawables = [];
    
    var m_cRenderer = null;
    var m_aCameraStack = [];
    
    var m_cDefaultCamera = null;
    var m_cCurrentCamera = null;
    
    return {
        Init: function(cRenderer){
            m_cRenderer = cRenderer;
            m_cDefaultCamera = new Camera();
            m_cCurrentCamera = m_cDefaultCamera;
        },
        RegisterDrawable: function(cDrawable){
            m_aDrawables.push(cDrawable);
        },
        UnregisterDrawable: function(cDrawable){
            m_aDrawables.splice(m_aDrawables.indexOf(cDrawable), 1);
        },
        PushCamera: function(cCamera){
            m_aCameraStack.push(cCamera);
            m_cCurrentCamera = cCamera;
            m_cRenderer.SetCamera(cCamera);
        },
        PopCamera: function(){
            m_aCameraStack.pop();
            
            if (m_aCameraStack.length)
            {
                m_cCurrentCamera = m_aCameraStack[m_aCameraStack.length - 1];
            }
            else
            {
                m_cCurrentCamera = m_cDefaultCamera;
            }
        },
        Draw: function(){
            var cCameraPos = m_cCurrentCamera.Pos;
            var cViewport = m_cCurrentCamera.Viewport;
            var cCameraXMax = cCameraPos.x + cViewport.width;
            var cCameraYMax = cCameraPos.y + cViewport.height;
            
            m_aDrawables.sort(function(a, b){
                return a.zIndex - b.zIndex;
            });
            
            m_aDrawables.forEach(function(cDrawable){
                var cDrawablePos = cDrawable.Pos;
                
                if (!(cDrawablePos.x > cCameraXMax || cDrawablePos.y > cCameraYMax || (cDrawablePos.x + cDrawable.Width) < cCameraPos.x || (cDrawablePos.y + cDrawable.Height) < cCameraPos.y))
                {
                    cDrawable.Draw(m_cRenderer);
                }
            });
        }
    };
})();

//# sourceURL=rendering/drawmanager.js