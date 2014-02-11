include("collision/collisionutils.js", true);
include("collision/collisiongrid.js", true);

var CollisionGrid = EN.CollisionGrid;
var CollisionUtils = EN.CollisionUtils;

EN.Collision = (function(){
    var m_nCollisionGridSize = 100;
    var m_cCollisionResponse = {};
    
    return {
        Init: function(nWorldWidth, nWorldHeight){
            CollisionGrid.Init(m_nCollisionGridSize, nWorldWidth, nWorldHeight);
        },
        Update: function(aEntities){
            CollisionGrid.UpdateGrid(aEntities);
        },
        RegisterCollisionResponse: function(cMap, fOnCollision){
            for (var sType1 in cMap)
            {
                var aCollisionEntities = cMap[sType1];
                
                aCollisionEntities.forEach(function(sType2){
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
                });
            }
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
                                var sCollision1Name = cEntity1.CollisionName || cEntity1.constructor.name;
                                var sCollision2Name = cEntity2.CollisionName || cEntity2.constructor.name;
                                
                                if (m_cCollisionResponse[sCollision1Name] && m_cCollisionResponse[sCollision1Name][sCollision2Name])
                                {
                                    var cCollision = {};
                                    cCollision[sCollision1Name] = cEntity1;
                                    cCollision[sCollision2Name] = cEntity2;
                                    
                                    m_cCollisionResponse[sCollision1Name][sCollision2Name](cCollision);
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

//# sourceURL=engine/collision/collision.js