include("math/vector.js", true);
include("game/camera.js", true);

var Cam = EN.Camera;

var StateManager = (function(){
    var m_cRegisteredStats = {};
    var m_sNextState = null;
    var m_aStateStack = [];
    
    var m_cTransitions = {};
    var m_cTransitionUpdate = null;
    
    function Init()
    {
        var cCameraState = {
            Pos: new EN.Vector(0, 0),
            ViewportWidth: EN.device.width,
            ViewportHeight: EN.device.height
        };
        
        var cDrawTransform = {
            Pos: { x: 0, y: 0 },
            Scale: 1,
            Rotation: 0,
            WorldSpace: false
        };
        
        m_cTransitions[StateManager.TRANSITIONS.FADE] = function(fOnSwitch, fOnEnd){
            var nAlpha = 0;
            var bFade = true;
            var nFadeTime = 1000;
            var nCurrentTime = 0;
            var bSwitch = false;
            
            return {
                Update: function(nDt){
                    nCurrentTime += nDt;
                    
                    var nTimePercent = nCurrentTime / nFadeTime;
                    bFade = nTimePercent < 0.5;
                    
                    nAlpha = bFade ? nTimePercent / 0.5 : 1 - ((nTimePercent - 0.5) / 0.5);
                    
                    if (!bFade && !bSwitch)
                    {
                        fOnSwitch();
                        bSwitch = true;
                    }
                    
                    if (nCurrentTime >= nFadeTime)
                    {
                        fOnEnd();
                    }
                },
                Draw: function(cRenderer){
                    Cam.PushState(cCameraState);
                    cRenderer.DrawRectangle(cDrawTransform, EN.device.width, EN.device.height, "rgba(0, 0, 0, " + nAlpha + ")");
                    Cam.PopState();
                }
            };
        };

        m_cTransitions[StateManager.TRANSITIONS.INSTANT] = function(fOnSwitch, fOnEnd){
            return {
                Update: function(nDt){
                    fOnSwitch();
                    fOnEnd();
                },
                Draw: function(cRenderer){}
            };
        };
    }
    
    function ReplaceStates()
    {
        var sCurrentState = m_aStateStack[m_aStateStack.length - 1];
        var sPreviousState = m_aStateStack[m_aStateStack.length - 2];
        
        if (sCurrentState)
        {
            m_cRegisteredStats[sCurrentState].Exit();
            m_aStateStack.pop();
        }
        
        if (sPreviousState == m_sNextState)
        {
            m_cRegisteredStats[m_sNextState].Resume();
        }
        else
        {
            m_cRegisteredStats[m_sNextState].Enter();
            m_aStateStack.push(m_sNextState);
        }
        
        m_sNextState = null;
    }
    
    function SwitchStates()
    {
        var sCurrentState = m_aStateStack[m_aStateStack.length - 1];
        
        if (sCurrentState)
        {
            m_cRegisteredStats[sCurrentState].Pause();
        }
        
        m_cRegisteredStats[m_sNextState].Enter();
        m_aStateStack.push(m_sNextState);
        
        m_sNextState = null;
    }
    
    function TransitionEnd()
    {
        m_cTransitionUpdate = null;
    }
    
    function ChangeStates(sState, fOnStateChange, transition)
    {
        var sTransitionType = typeof transition;
            
        var fTransition = m_cTransitions[StateManager.TRANSITIONS.FADE];

        switch(sTransitionType)
        {
            case "string":
                if (isset(m_cTransitions[transition]))
                {
                    fTransition = m_cTransitions[transition];
                }
                break;
            case "function":
                fTransition = transition;
                break;
        }

        if (m_cRegisteredStats[sState])
        {
            var sPreviousState = m_aStateStack[m_aStateStack.length - 2];
            
            if (isset(m_cRegisteredStats[sState].Load) && sPreviousState != sState)
            {
                m_cRegisteredStats[sState].Load(function(){
                    m_sNextState = sState;
                    m_cTransitionUpdate = fTransition(fOnStateChange, TransitionEnd);
                });
            }
            else
            {
                m_sNextState = sState;
                m_cTransitionUpdate = fTransition(fOnStateChange, TransitionEnd);
            }
        }
    }
    
    return {
        Init: function(cRegisteredStates){
            m_cRegisteredStats = cRegisteredStates;
            Init();
        },
        ChangeState: function(sState, transition){
            ChangeStates(sState, ReplaceStates, transition);
        },
        PushState: function(sState, transition){
            ChangeStates(sState, SwitchStates, transition);
        },
        PopState: function(){
            ChangeStates(m_aStateStack[m_aStateStack.length - 2], ReplaceStates);
        },
        Update: function(nDt){
            var sCurrentState = m_aStateStack[m_aStateStack.length - 1];
            
            if (m_cRegisteredStats[sCurrentState])
            {
                m_cRegisteredStats[sCurrentState].Update(nDt);
            }
            
            if (m_cTransitionUpdate)
            {
                m_cTransitionUpdate.Update(nDt);
            }
        },
        Draw: function(cRenderer){
            var sCurrentState = m_aStateStack[m_aStateStack.length - 1];
    
            if (m_cRegisteredStats[sCurrentState])
            {
                m_cRegisteredStats[sCurrentState].Draw(cRenderer);
            }
    
            if (m_cTransitionUpdate)
            {
                m_cTransitionUpdate.Draw(cRenderer);
            }
        }
    };
})();

    
/**
 * Enum of available transitions
 * 
 * @readonly
 * @enum {string}
 */
StateManager.TRANSITIONS = {
   FADE: "Fade",
   INSTANT: "Instant"
};

/**
 * State Enum Declaration 
 * 
 * State manager starts empty and states are registered during initialization
 */
StateManager.STATES = {};

EN.StateManager = StateManager;
//# sourceURL=engine/states/statemanager.js