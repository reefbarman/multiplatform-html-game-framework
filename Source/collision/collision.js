include("collision/collisionutils.js", true);

var Collision = (function(){
    
    var m_nCollisionGridSize = 100;
    
    return {
        Init: function(nWorldWidth, nWorldHeight){
            CollisionGrid.Init(m_nCollisionGridSize, nWorldWidth, nWorldHeight);
        },
        Update: function(aEntities){
            CollisionGrid.UpdateGrid(aEntities);
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
        },
        GetCollidingPairs: function(){
            var aChecked = [];
            
            
        }
    };
})();

//# sourceURL=collision/collision.js