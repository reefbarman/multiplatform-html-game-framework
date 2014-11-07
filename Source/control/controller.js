include("math/vector.js", true);

var Vec = EN.Vector;

EN.Controller = (function(){
    var m_eCanvas = null;
    
    var m_cBoundEvents = {
        "down": {},
        "move": {},
        "up": {}
    };

    var m_cKeyEvents = {};
    
    var m_nEventId = 0;
    
    function InputStart(e)
    {
        e.preventDefault();
        
        try
        {
            var nX = 0;
            var nY = 0;
            
            if (isset(e.changedTouches))
            {
                nX = e.changedTouches[0].clientX;
                nY = e.changedTouches[0].clientY;
            }
            else
            {
                nX = e.clientX;
                nY = e.clientY;
            }
            
            for (var sKey in m_cBoundEvents.down)
            {
                m_cBoundEvents.down[sKey](new Vec(nX, nY));
            }
        }
        catch (e)
        {
            console.error(e.stack);
            throw e;
        }
        
        return false;
    }
    
    function InputMove(e)
    {
        e.preventDefault();
        
        setTimeout(function(){
            try
            {
                var nX = 0;
                var nY = 0;

                if (isset(e.changedTouches))
                {
                    nX = e.changedTouches[0].clientX;
                    nY = e.changedTouches[0].clientY;
                }
                else
                {
                    nX = e.clientX;
                    nY = e.clientY;
                }

                for (var sKey in m_cBoundEvents.move)
                {
                    m_cBoundEvents.move[sKey](new Vec(nX, nY));
                }
            }
            catch (e)
            {
                console.error(e.stack);
                throw e;
            }
        }, 0);
        
        return false;
    }
    
    function InputEnd(e)
    {
        e.preventDefault();
        
        try
        {
            var nX = 0;
            var nY = 0;


            if (isset(e.changedTouches))
            {
                nX = e.changedTouches[0].clientX;
                nY = e.changedTouches[0].clientY;
            }
            else
            {
                nX = e.clientX;
                nY = e.clientY;
            }

            for (var sKey in m_cBoundEvents.up)
            {
                m_cBoundEvents.up[sKey](new Vec(nX, nY));
            }
        }
        catch (e)
        {
            console.error(e.stack);
            throw e;
        }
        
        return false;
    }

    function KeyDown(e)
    {
        m_cKeyEvents[e.keyCode] = true;
    }

    function KeyUp(e)
    {
        m_cKeyEvents[e.keyCode] = false;
    }
    
    return {
        Init: function(eCanvas){
            m_eCanvas = eCanvas;
            
            eCanvas.addEventListener("mousedown", InputStart);
            eCanvas.addEventListener("mousemove", InputMove);
            eCanvas.addEventListener("mouseup", InputEnd);

            //Detect platform and bind relevant events
            if (EN.Device.OS == EN.Device.SUPPORTED_OS.Windows || EN.Device.OS == EN.Device.SUPPORTED_OS.MacOSX)
            {
                window.onkeydown = KeyDown;
                window.onkeyup = KeyUp;
            }
            else
            {
                eCanvas.addEventListener("touchstart", InputStart);
                eCanvas.addEventListener("touchend", InputEnd);
            }
        },
        Bind: function(sEventType, fOnInput){
            var nId = m_nEventId++;
    
            m_cBoundEvents[sEventType][nId] = fOnInput;
            
            return nId;
        },
        Unbind: function(sEventType, nEventId){
            delete m_cBoundEvents[sEventType][nEventId];
        },
        GetKeyDown: function(nKey){
            return isset(m_cKeyEvents[nKey]) ? m_cKeyEvents[nKey] : false;
        }
    };
})();

EN.Controller.Keys = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    A: 65,
    Z: 90
};

//# sourceURL=engine/control/controller.js
