include("particles/particle.js", true);
include("particles/emitter.js", true);

EN.ParticleSystem = (function(){

    var m_aEmitters = [];
    
    var m_nPlaygroundSelectedEmitter = 0;
    
    function ResetParticleEmitter(nEmitter)
    {
        if (isset(m_aEmitters[nEmitter]))
        {
            m_aEmitters[nEmitter].Reset();
        }
    }
    
    function RestartParticleEmitter(nEmitter)
    {
        if (isset(m_aEmitters[nEmitter]))
        {
            m_aEmitters[nEmitter].Restart();
        }
    }
    
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
            //If we are within the playground environment allow it to request emitter details
            if (EN.playgroundEnv)
            {
                window["playgroundResetParticleEmitter"] = ResetParticleEmitter;
                window["playgroundRestartParticleEmitter"] = RestartParticleEmitter;
                window["playgroundGetParticleEmitters"] = SendEmitterState;
                window["playgroundModifyParticleEmitter"] = ModifyParticleEmitter;
            }
        },
        RegisterEmitter: function(cEmitter){
            m_aEmitters.push(cEmitter);
            SendEmitterState(m_nPlaygroundSelectedEmitter);
        }
    };
})();

//# sourceURL=engine/particles/particlesystem.js