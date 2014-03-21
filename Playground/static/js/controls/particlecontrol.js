function ParticleControl()
{
    var m_$ParticleControls = null;
    
    var m_cEmitter = {
        Emitter: 0
    };
    
    var m_cValueDefinitions = {
        Emitter: {
            folder: true,
            children: {
                EmissionRate: {
                    minMax: [1, 5000],
                    value: 10,
                    step: 1
                },
                MaxParticles: {
                    minMax: [1, 5000],
                    value: 100,
                    step: 1
                },
                Angle: {
                    minMax: [0, 360],
                    value: 90
                },
                AngleVariance: {
                    minMax: [0, 360],
                    value: 10
                },
                PosX: 0,
                PosY: 0,
                PosVarianceX: 0,
                PosVarianceY: 0,
                Continuous: true
            }
        },
        Particles: {
            folder: true,
            children: {
                Life: 1000,
                LifeVariance: 500,
                ParticleSpeed: {
                    minMax: [0, 2],
                    value: 0.1
                },
                PSpeedVariance: 0,
                StartParticleRadius: 10,
                EndParticleRadius: 10,
                StartColor: {
                    color: true,
                    value: "rgb(255, 0, 0)"
                },
                StartColorAlpha: {
                    minMax: [0, 1],
                    value: 1
                },
                EndColor: {
                    color: true,
                    value: "rgb(255, 0, 0)"
                },
                EndColorAlpha: {
                    minMax: [0, 1],
                    value: 1
                },
                AdditiveColor: false
            }
        }
    };
    
    var m_cParticleValues = {};
    
    var m_cParticleEmitters = {};
    
    var m_cDatGui = null;
    
    function Init()
    {
        m_$ParticleControls = $("<div>").addClass("cPG_ParticleControls");
        
        EventDispatcher.Bind("Particles", function(cData){
            if (cData.particleEmitters)
            {
                m_cParticleEmitters = cData.particleEmitters;
            }
            
            if (cData.currentEmitterValues)
            {
                for (var sKey in cData.currentEmitterValues)
                {
                    var val = cData.currentEmitterValues[sKey];

                    m_cParticleValues[sKey] = val;
                }
            }
            
            if (m_cDatGui)
            {
                InitGUI();
            }
        });
    }
    
    function InitGUI()
    {
        var fOnValueUpdate = function(sValueName, value){
            EventDispatcher.Trigger("SendMessage", {
                message: "ModifyParticleEmitter", 
                data: {
                    emitter: m_cEmitter.Emitter,
                    valueName: sValueName,
                    value: value
                }
            });
        };
        
        m_$ParticleControls.empty();
        
        m_cDatGui = new dat.GUI({ autoPlace: false});
        
        m_cDatGui.add(m_cEmitter, "Emitter", m_cParticleEmitters).onChange(SelectNewEmitter);
        
        var fBuildGUI = function(cGui, cDefinitions){
            for (var sKey in cDefinitions)
            {
                var def = cDefinitions[sKey];
                
                var bObject = typeof def == "object" && !Array.isArray(def);
                
                if (bObject && def.folder)
                {
                    var cFolder = cGui.addFolder(sKey);
                    
                    if (def.children)
                    {
                        fBuildGUI(cFolder, def.children);
                    }
                }
                else
                {
                    if (bObject)
                    {
                        if (typeof m_cParticleValues[sKey] == "undefined")
                        {
                            m_cParticleValues[sKey] = def.value;
                        }

                        var cValue = null;
                            
                        if (def.color)
                        {
                            cValue = cGui.addColor(m_cParticleValues, sKey);
                        }
                        else
                        {
                            if (def.minMax)
                            {
                                cValue = cGui.add.apply(cGui, [m_cParticleValues, sKey].concat(def.minMax));
                            }
                            else
                            {
                                cValue = cGui.add(m_cParticleValues, sKey);
                            }

                            if (def.step)
                            {
                                cValue.step(def.step);
                            }
                        }
                        
                        cValue.onChange((function(sKey){
                            return function(value){
                                fOnValueUpdate(sKey, value);
                            };
                        })(sKey));
                    }
                    else
                    {
                        if (typeof m_cParticleValues[sKey] == "undefined")
                        {
                            m_cParticleValues[sKey] = def;
                        }
                        
                        cGui.add(m_cParticleValues, sKey).onChange((function(sKey){
                            return function(value){
                                fOnValueUpdate(sKey, value);
                            };
                        })(sKey));
                    }
                }
            }
        };

        fBuildGUI(m_cDatGui, m_cValueDefinitions);
        
        m_cDatGui.add({Reset: function(){
            EventDispatcher.Trigger("SendMessage", {
                message: "ResetParticleEmitter", 
                data: m_cEmitter.Emitter
            });
        }}, "Reset");
    
        m_cDatGui.add({Restart: function(){
            EventDispatcher.Trigger("SendMessage", {
                message: "RestartParticleEmitter", 
                data: m_cEmitter.Emitter
            });
        }}, "Restart");
        
        m_$ParticleControls.append(m_cDatGui.domElement);
    }
    
    function SelectNewEmitter(nEmitter)
    {
        EventDispatcher.Trigger("SendMessage", {
            message: "RequestParticleEmitterUpdate", 
            data: nEmitter
        });
    }
    
    this.Show = function(){
        InitGUI();
        
        $("body").append(m_$ParticleControls);
        
        SelectNewEmitter(m_cEmitter.Emitter);
    };
    
    this.Hide = function(){
        m_$ParticleControls.detach().empty();
        m_cDatGui = null;
    };
    
    Init();
}