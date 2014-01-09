var EntityManager = (function(){
    
    var m_aEntities = [];
    
    return {
        RegisterEntity: function(cEntity){
            m_aEntities.push(cEntity);
        },
        Update: function(nDt){
            m_aEntities.forEach(function(cEntity){
                cEntity.Update(nDt);
            });
        }
    };
})();

//# sourceURL=entities/entitymanager.js