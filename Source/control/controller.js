var Controller = (function(){
    var m_eCanvas = null;
    
    var m_cBoundEvents = {
        "tap": {},
        "drag": {}
    };
    
    var m_nEventId = 0;
    
    function InputStart(e)
    {
        try
        {
            for (var sKey in m_cBoundEvents.tap)
            {
                m_cBoundEvents.tap[sKey].onTap(e.clientX, e.clientY);
            }

            for (var sKey in m_cBoundEvents.drag)
            {
                m_cBoundEvents.drag[sKey].onDragStart(e.clientX, e.clientY);
            }
        }
        catch (e)
        {
            console.error(e.stack);
        }
    }
    
    function InputMove(e)
    {
        setTimeout(function(){
            try
            {
                for (var sKey in m_cBoundEvents.drag)
                {
                    m_cBoundEvents.drag[sKey].onDrag(e.clientX, e.clientY);
                }
            }
            catch (e)
            {
                console.error(e.stack);
            }
        }, 0);
    }
    
    function InputEnd(e)
    {
        try
        {
            for (var sKey in m_cBoundEvents.drag)
            {
                m_cBoundEvents.drag[sKey].onDragEnd(e.clientX, e.clientY);
            }
        }
        catch (e)
        {
            console.error(e.stack);
        }
    }
    
    return {
        Init: function(eCanvas){
            m_eCanvas = eCanvas;

            eCanvas.addEventListener("touchstart", InputStart);
            eCanvas.addEventListener("mousedown", InputStart);
            
            eCanvas.addEventListener("mousemove", InputMove);
            
            eCanvas.addEventListener("mouseup", InputEnd);
        },
        Bind: function(sEventType, cOptions){
            var nId = m_nEventId++;
    
            m_cBoundEvents[sEventType][nId] = cOptions;
            
            return nId;
        },
        Unbind: function(sEventType, nEventId){
            delete m_cBoundEvents[sEventType][nEventId];
        }
    };
})();

//# sourceURL=control/controller.js