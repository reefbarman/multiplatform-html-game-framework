include("collision/collision.js", true);

var Collision = EN.Collision;

EN.EntityManager = (function(){
    
    var m_aEntities = [];
    var m_nCurrentId = 0;
    
    return {
        RegisterEntity: function(cEntity){
            if (cEntity.ID === null)
            {
                cEntity.ID = m_nCurrentId++;
            }
            
            m_aEntities.push(cEntity);
        },
        UnregisterEntity: function(cEntity){
            m_aEntities.splice(m_aEntities.indexOf(cEntity), 1);
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

//# sourceURL=engine/entities/entitymanager.js