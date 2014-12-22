EN.CameraManager = (function(){
    var m_aCameraStack = [];
    
    return {
        Push: function(cCamera){
            m_aCameraStack.push(cCamera);
        },
        Pop: function(){
            m_aCameraStack.pop();
        },
        GetCamera: function(){
            return m_aCameraStack[m_aCameraStack.length - 1];
        }
    };
})();
