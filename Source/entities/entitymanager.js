include("collision/collisiongrid.js", true);

var EntityManager = (function(){
    
    var m_aEntities = [];
    var m_nCurrentId = 0;
    
    return {
        RegisterEntity: function(cEntity){
            cEntity.ID = m_nCurrentId++;
            m_aEntities.push(cEntity);
        },
        Update: function(nDt){
            m_aEntities.forEach(function(cEntity){
                cEntity.Update(nDt);
            });
            
            Collision.Update(m_aEntities);
            Collision.HandleEntityCollisions();
        }
    };
})();

//# sourceURL=entities/entitymanager.js