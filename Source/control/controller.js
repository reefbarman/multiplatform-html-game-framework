var Controller = (function(){
    var m_eCanvas = null;
    
    var m_cBoundEvents = {
        "tap": {},
        "drag": {},
        "hold": {}
    };
    
    var m_nEventId = 0;
    
    var m_nEventStart = 0;
    
    function InputStart(e)
    {
        e.preventDefault();
        
        try
        {
            var nNow = Date.now();
            
            var nX = 0;
            var nY = 0;
            
            if (isset(e.touches))
            {
                nX = e.touches[0].clientX;
                nY = e.touches[0].clientY;
            }
            else
            {
                nX = e.clientX;
                nY = e.clientY;
            }
            
            for (var sKey in m_cBoundEvents.tap)
            {
                m_cBoundEvents.tap[sKey].onTap(nX, nY);
            }

            for (var sKey in m_cBoundEvents.drag)
            {
                m_cBoundEvents.drag[sKey].onDragStart(nX, nY);
            }
            
            m_nEventStart = nNow;
        }
        catch (e)
        {
            console.error(e.stack);
            throw e;
        }
    }
    
    function InputMove(e)
    {
        e.preventDefault();
        
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
                throw e;
            }
        }, 0);
    }
    
    function InputEnd(e)
    {
        e.preventDefault();
        
        try
        {
            for (var sKey in m_cBoundEvents.drag)
            {
                m_cBoundEvents.drag[sKey].onDragEnd(e.clientX, e.clientY);
            }
            
            for (var sKey in m_cBoundEvents.hold)
            {
                m_cBoundEvents.hold[sKey].onHold(Date.now() - m_nEventStart);
            }
        }
        catch (e)
        {
            console.error(e.stack);
            throw e;
        }
    }
    
    return {
        Init: function(eCanvas){
            m_eCanvas = eCanvas;

            eCanvas.addEventListener("touchstart", InputStart);
            eCanvas.addEventListener("touchend", InputEnd);
            
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