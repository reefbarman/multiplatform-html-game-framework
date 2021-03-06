include("math/vector.js", true);
include("timing/timer.js", true);

var Timer = EN.Timer;

var StateManager = (function(){
    var m_cRegisteredStats = {};
    var m_sNextState = null;
    var m_aStateStack = [];
    
    var m_cTransitions = {};
    var m_cTransitionUpdate = null;
    
    var m_cNextArgs = {};
    
    function Init()
    {
        var cCamera = new EN.Camera();
        cCamera.Init();
        
        var cMatrix = new EN.Matrix();
        
        var cColor = new EN.Color(0, 0, 0, 0);
        
        m_cTransitions[StateManager.TRANSITIONS.FADE] = function(fOnSwitch, fOnEnd){
            var nAlpha = 0;
            var bFade = true;
            var nFadeTime = 1000;
            var nCurrentTime = 0;
            var bSwitch = false;
            
            return {
                Update: function(){
                    nCurrentTime += Timer.DeltaTime;
                    
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
                    EN.CameraManager.Push(cCamera);
                    cColor.a = nAlpha;
                    cRenderer.DrawRectangle(cMatrix, EN.Game.Viewport.Width, EN.Game.Viewport.Height, cColor);
                    EN.CameraManager.Pop();
                }
            };
        };

        m_cTransitions[StateManager.TRANSITIONS.INSTANT] = function(fOnSwitch, fOnEnd){
            return {
                Update: function(){
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
            m_cRegisteredStats[m_sNextState].Resume(m_cNextArgs);
        }
        else
        {
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
        
        m_aStateStack.push(m_sNextState);
        
        m_sNextState = null;
    }
    
    function TransitionEnd()
    {
        m_cTransitionUpdate = null;
    }
    
    function ChangeStates(sState, fOnStateChange, transition, cArgs)
    {
        m_cNextArgs = cArgs;
        
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
                    m_cRegisteredStats[m_sNextState].Enter(m_cNextArgs);
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
        ChangeState: function(sState, transition, cArgs){
            cArgs = cArgs || {};
            
            ChangeStates(sState, ReplaceStates, transition, cArgs);
        },
        PushState: function(sState, transition, cArgs){
            cArgs = cArgs || {};
            
            ChangeStates(sState, SwitchStates, transition, cArgs);
        },
        PopState: function(){
            ChangeStates(m_aStateStack[m_aStateStack.length - 2], ReplaceStates);
        },
        Update: function(){
            m_aStateStack.forEach(function(sState){
                m_cRegisteredStats[sState].Update();
            });
            
            if (m_cTransitionUpdate)
            {
                m_cTransitionUpdate.Update();
            }
        },
        Draw: function(cRenderer){
            m_aStateStack.forEach(function(sState){
                m_cRegisteredStats[sState].Draw(cRenderer);
            });
    
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
