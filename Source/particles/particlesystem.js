include("particles/particle.js", true);
include("particles/emitter.js", true);

EN.ParticleSystem = (function(){
    
    var m_bInited = false;
    
    var m_aEmitters = [];
    
    var m_nPlaygroundSelectedEmitter = 0;
    
    function SendEmitterState(nEmitter)
    {
        m_nPlaygroundSelectedEmitter = nEmitter;
                        
        var cEmitters = {};

        for (var i = 0; i < m_aEmitters.length; i++)
        {
            cEmitters["Emitter" + i] = i;
        }

        var cEmitterValues = null;

        if (isset(m_aEmitters[nEmitter]))
        {
            cEmitterValues = m_aEmitters[nEmitter].GetValues();
        }

        if (isset(window["playgroundParticles"]))
        {
            window["playgroundParticles"]({
                particleEmitters: cEmitters,
                currentEmitterValues: cEmitterValues
            });
        }
    }
    
    function ModifyParticleEmitter(cArgs)
    {
        if (isset(m_aEmitters[cArgs.emitter]))
        {
            switch (cArgs.valueName)
            {
                default:
                    m_aEmitters[cArgs.emitter].UpdateValue(cArgs.valueName, cArgs.value);
                    break;
            }
        }
    }
    
    return {
        Init: function(){
            if (!m_bInited)
            {
                //If we are within the playground environment allow it to request emitter details
                if (EN.playgroundEnv)
                {
                    window["playgroundGetParticleEmitters"] = SendEmitterState;
                    window["playgroundModifyParticleEmitter"] = ModifyParticleEmitter;
                }
                
                m_bInited = true;
            }
        },
        RegisterEmitter: function(cEmitter){
            m_aEmitters.push(cEmitter);
            cEmitter.Init();
            
            EN.DrawManager.RegisterDrawable(cEmitter);
            
            SendEmitterState(m_nPlaygroundSelectedEmitter);
        },
        Update: function(nDt){
            m_aEmitters.forEach(function(cEmitter){
                cEmitter.Update(nDt);
            });
        }
    };
})();

//# sourceURL=engine/particles/particlesystem.js