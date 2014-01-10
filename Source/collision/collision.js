include("collision/collisionutils.js", true);

var Collision = (function(){
    
    var m_nCollisionGridSize = 100;
    var m_cCollisionResponse = {};
    
    return {
        Init: function(nWorldWidth, nWorldHeight){
            CollisionGrid.Init(m_nCollisionGridSize, nWorldWidth, nWorldHeight);
        },
        Update: function(aEntities){
            CollisionGrid.UpdateGrid(aEntities);
        },
        RegisterCollisionResponse: function(sType1, sType2, fOnCollision){
            if (!m_cCollisionResponse[sType1])
            {
                m_cCollisionResponse[sType1] = {};
            }
            
            m_cCollisionResponse[sType1][sType2] = fOnCollision;
            
            if (!m_cCollisionResponse[sType2])
            {
                m_cCollisionResponse[sType2] = {};
            }
            
            m_cCollisionResponse[sType2][sType1] = fOnCollision;
        },
        GetPointCollision: function(cPos){
            var cCollidingEntity = null;
            
            var aEntities = CollisionGrid.GetPointCollision(cPos);
            
            aEntities.sort(function(a, b){
                return a.zIndex - b.zIndex;
            });
            
            aEntities.forEach(function(cEntity){
                if (CollisionUtils.TestPointIntersect(cPos, cEntity))
                {
                    cCollidingEntity = cEntity;
                }
            });
            
            return cCollidingEntity;
        },
        HandleEntityCollisions: function(){
            CollisionGrid.IterateGrid(function(aEntities){
                var cChecked = {};
                
                for (var i = 0; i < aEntities.length; i++)
                {
                    for (var j = 0; j < aEntities.length; j++)
                    {
                        var cEntity1 = aEntities[i];
                        var cEntity2 = aEntities[j];
                        
                        var sHash1 = cEntity1.ID + ":" + cEntity2.ID;
                        var sHash2 = cEntity2.ID + ":" + cEntity1.ID;
                        
                        if (i != j && !cChecked[sHash1] && !cChecked[sHash2])
                        {
                            if (CollisionUtils.TestEntityIntersect(cEntity1, cEntity2))
                            {
                                var sEntity1Name = cEntity1.constructor.name;
                                var sEntity2Name = cEntity2.constructor.name;
                                
                                if (m_cCollisionResponse[sEntity1Name] && m_cCollisionResponse[sEntity1Name][sEntity2Name])
                                {
                                    var cCollision = {};
                                    cCollision[sEntity1Name] = cEntity1;
                                    cCollision[sEntity2Name] = cEntity2;
                                    
                                    m_cCollisionResponse[sEntity1Name][sEntity2Name](cCollision);
                                }
                            }
                            
                            cChecked[sHash1] = true;
                            cChecked[sHash2] = true;
                        }
                    }
                }
            });
        }
    };
})();

//# sourceURL=collision/collision.js