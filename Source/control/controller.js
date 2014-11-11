include("math/vector.js", true);

var Vec = EN.Vector;

EN.Controller = (function(){
    var m_eCanvas = null;
    
    var m_cKeyEvents = {};
    var m_cButtonEvents = {};
    var m_cInputPos = new EN.Vector();
    var m_nScrollDelta = 0;
    
    function InputStart(e)
    {
        e.preventDefault();

        m_cButtonEvents[e.button] = true;
        
        /*try
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
        }*/
        
        return false;
    }
    
    function InputMove(e)
    {
        m_cInputPos.x = e.clientX;
        m_cInputPos.y = e.clientY;

        /*setTimeout(function(){
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
        }, 0);*/
    }
    
    function InputEnd(e)
    {
        e.preventDefault();

        m_cButtonEvents[e.button] = false;
        
        /*try
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
        }*/
        
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

    function Scroll(e)
    {
        m_nScrollDelta = (e.wheelDeltaY / 120);
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

                window.onmousewheel = Scroll;

                eCanvas.oncontextmenu = function(e){
                    e.preventDefault();
                    return false;
                };
            }
            else
            {
                eCanvas.addEventListener("touchstart", InputStart);
                eCanvas.addEventListener("touchend", InputEnd);
            }
        },
        GetInputPos: function(){
            return m_cInputPos;
        },
        GetKeyDown: function(nKey){
            return m_cKeyEvents[nKey];
        },
        GetButtonDown: function(nButton){
            return m_cButtonEvents[nButton];
        },
        GetScrollDelta: function(){
            var nScrollDelta = m_nScrollDelta;
            m_nScrollDelta = 0;
            return nScrollDelta;
        }
    };
})();

EN.Controller.Buttons = {
    LEFT: 0,
    RIGHT: 2
}

EN.Controller.Keys = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    A: 65,
    Z: 90
};

//# sourceURL=engine/control/controller.js
