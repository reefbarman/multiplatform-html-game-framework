var Controller = (function(){
    var m_eCanvas = null;
    
    var m_cBoundEvents = {
        "tap": {}
    };
    
    var m_nEventId = 0;
    
    return {
        Init: function(eCanvas){
            m_eCanvas = eCanvas;
            
            Hammer(m_eCanvas).on("tap", function(e){
                for (var sKey in m_cBoundEvents.tap)
                {
                    m_cBoundEvents.tap[sKey](e.gesture.touches[0].clientX, e.gesture.touches[0].clientY);
                }
            });
        },
        Bind: function(sEventType, fOnEvent){
            var nId = m_nEventId++;
    
            m_cBoundEvents[sEventType][nId] = fOnEvent;
            
            return nId;
        },
        Unbind: function(sEventType, nEventId){
            delete m_cBoundEvents.tap[nEventId];
        }
    };
})();