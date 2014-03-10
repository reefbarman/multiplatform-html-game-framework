EN.DisplayList = (function(){
    var m_aDisplayList = [];
    
    return {
        Add: function(cGameObject){
            m_aDisplayList.push(cGameObject);
        },
        Remove: function(cGameObject){
            m_aDisplayList.splice(m_aDisplayList.indexOf(cGameObject), 1);
        },
        Draw: function(cRenderer){
            m_aDisplayList.sort(function(a, b){
                return a.zIndex - b.zIndex;
            });
            
            m_aDisplayList.forEach(function(cGameObject){
                cGameObject.Draw(cRenderer);
            });
        }
    };
})();

//# sourceURL=engine/rendering/displaylist.js