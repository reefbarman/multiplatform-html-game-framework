EN.CameraManager = (function(){
    var m_aCameraStack = [];
    
    return {
        Push: function(cCamera){
            m_aCameraStack.push(cCamera);
        },
        Pop: function(){
            m_aCameraStack.pop();
        },
        Update: function(nDt){
            m_aCameraStack[m_aCameraStack.length - 1].Update(nDt);
        },
        GetCamera: function(){
            return m_aCameraStack[m_aCameraStack.length - 1];
        }
    };
})();

//# sourceURL=engine/game/cameramanager.js