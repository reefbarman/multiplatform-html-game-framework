include("collision/collisionutils.js", true);

var Collision = (function(){
    
    var m_nCollisionGridSize = 100;
    
    return {
        Init: function(nWorldWidth, nWorldHeight){
            CollisionGrid.Init(m_nCollisionGridSize, nWorldWidth, nWorldHeight);
        },
        GetPointCollision: function(cPos){
            var cCollidingEntity = null;
            
            var aEntities = CollisionGrid.GetPointCollision(cPos);
            
            aEntities.forEach(function(cEntity){
                if (CollisionUtils.TestPointIntersect(cPos, cEntity))
                {
                    cCollidingEntity = cEntity;
                }
            });
            
            return cCollidingEntity;
        }
    };
})();

//# sourceURL=collision/collision.js