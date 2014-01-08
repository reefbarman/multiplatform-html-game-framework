var StateManager = (function(){
    var m_cRegisteredStats = {};
    var m_sCurrentState = null;
    var m_sNextState = null;
    
    var m_cTransitions = {};
    var m_cTransitionUpdate = null;
    
    var m_cRenderer = null;
    var m_cCamera = null;
    
    function Init()
    {
        m_cCamera = new Camera();
        
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
                Draw: function(){
                    m_cRenderer.PushCamera(m_cCamera);
                    m_cRenderer.DrawRectangle({x: 0, y: 0}, window.cannonQuest.device.width, window.cannonQuest.device.height, "rgba(0, 0, 0, " + nAlpha + ")");
                    m_cRenderer.PopCamera();
                }
            };
        };

        m_cTransitions[StateManager.TRANSITIONS.INSTANT] = function(fOnSwitch, fOnEnd){
            return {
                Update: function(nDt){
                    fOnSwitch();
                    fOnEnd();
                },
                Draw: function(){}
            };
        };
    }
    
    function SwitchStates()
    {
        if (m_sCurrentState)
        {
            m_cRegisteredStats[m_sCurrentState].Exit();
        }
        
        m_cRegisteredStats[m_sNextState].Enter();
        
        m_sCurrentState = m_sNextState;
        m_sNextState = null;
    }
    
    function TransitionEnd()
    {
        m_cTransitionUpdate = null;
    }
    
    return {
        Init: function(cRegisteredStates, cRenderer){
            m_cRegisteredStats = cRegisteredStates;
            m_cRenderer = cRenderer;
            
            Init();
        },
        ChangeState: function(sState, transition){
            //TODO TC: May have to implement a queue of state changes so we don't miss or override any!
    
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
                if (isset(m_cRegisteredStats[sState].Load))
                {
                    m_cRegisteredStats[sState].Load(function(){
                        m_sNextState = sState;
                        m_cTransitionUpdate = fTransition(SwitchStates, TransitionEnd);
                    });
                }
                else
                {
                    m_sNextState = sState;
                    m_cTransitionUpdate = fTransition(SwitchStates, TransitionEnd);
                }
            }
        },
        Update: function(nDt){
            if (m_cRegisteredStats[m_sCurrentState])
            {
                m_cRegisteredStats[m_sCurrentState].Update(nDt);
            }
            
            if (m_cTransitionUpdate)
            {
                m_cTransitionUpdate.Update(nDt);
            }
        },
        Draw: function(){
            if (m_cRegisteredStats[m_sCurrentState])
            {
                m_cRegisteredStats[m_sCurrentState].Draw();
            }
            
            if (m_cTransitionUpdate)
            {
                m_cTransitionUpdate.Draw();
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

//# sourceURL=states/statemanager.js