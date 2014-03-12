include("collision/collisionutils.js", true);
include("collision/collisiongrid.js", true);

var CollisionGrid = EN.CollisionGrid;
var CollisionUtils = EN.CollisionUtils;

EN.CollisionSystem = (function(){
    var m_nCollisionGridSize = 100;
    
    var m_aGameObjects = [];
    
    function HandleCollisions()
    {
        CollisionGrid.IterateGrid(function(aGameObjects){
            var cChecked = {};

            for (var i = 0; i < aGameObjects.length; i++)
            {
                for (var j = 0; j < aGameObjects.length; j++)
                {
                    var cGameObject1 = aGameObjects[i];
                    var cGameObject2 = aGameObjects[j];

                    var sHash1 = cGameObject1.ID + ":" + cGameObject2.ID;
                    var sHash2 = cGameObject2.ID + ":" + cGameObject1.ID;

                    if (i != j && !cChecked[sHash1] && !cChecked[sHash2])
                    {
                        if (cGameObject1.Bounds.CheckCollision(cGameObject2.Bounds))
                        {
                            cGameObject1.OnCollision(cGameObject2);
                            cGameObject2.OnCollision(cGameObject1);
                        }

                        cChecked[sHash1] = true;
                        cChecked[sHash2] = true;
                    }
                }
            }
        });
    }
    
    return {
        Init: function(nWorldWidth, nWorldHeight){
            CollisionGrid.Init(m_nCollisionGridSize, nWorldWidth, nWorldHeight);
        },
        Update: function(nDt){
            CollisionGrid.UpdateGrid(m_aGameObjects);
            HandleCollisions();
        },
        Add: function(cGameObject){
            m_aGameObjects.push(cGameObject);
        },
        Remove: function(cGameObject){
            m_aGameObjects.splice(m_aGameObjects.indexOf(cGameObject), 1);
        },
        GetPointCollision: function(cPos){
            /*var cCollidingObject = null;
            
            var aEntities = CollisionGrid.GetPointCollision(cPos);
            
            aEntities.sort(function(a, b){
                return a.zIndex - b.zIndex;
            });
            
            aEntities.forEach(function(cEntity){
                if (CollisionUtils.TestPointIntersect(cPos, cEntity))
                {
                    cCollidingObject = cEntity;
                }
            });
            
            return cCollidingObject;*/
        }
    };
})();

//# sourceURL=engine/collision/collisionsystem.js