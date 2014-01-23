include("particles/particle.js", true);
include("particles/emitter.js", true);

function ParticleSystem()
{
    this.m_aEmitters = [];
}

ParticleSystem.prototype.RegisterEmitter = function(cEmitter){
    this.m_aEmitters.push(cEmitter);
    cEmitter.Init();
};

ParticleSystem.prototype.Update = function(nDt){
    this.m_aEmitters.forEach(function(cEmitter){
        cEmitter.Update(nDt);
    });
};

EN.ParticleSystem = ParticleSystem;
//# sourceURL=engine/particles/particlesystem.js