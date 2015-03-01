//ECMAScript6
include("collision/collisiongrid.js", true);
include("collision/boundingbox.js", true);
include("collision/boundingcircle.js", true);

var CollisionGrid = EN.CollisionGrid;

class CollisionSystem
{
    constructor()
    {
        this.m_aGameObjects = [];
    }

    Init(nWorldWidth, nWorldHeight, nCellSize)
    {
        CollisionGrid.Init(nWorldWidth, nWorldHeight, nCellSize);
    }

    Add(cGameObject)
    {
        if (this.m_aGameObjects.indexOf(cGameObject) == -1)
        {
            this.m_aGameObjects.push(cGameObject);
        }
    }

    Remove(cGameObject)
    {
        var nIndex = this.m_aGameObjects.indexOf(cGameObject);

        if (nIndex >= 0)
        {
            this.m_aGameObjects.splice(nIndex, 1);
        }
    }

    GetPointCollision(cPos)
    {
        var aGameObjects = CollisionGrid.GetObjectsAtPoint(cPos);

        var aColliding = [];

        aGameObjects.forEach(function(cGameObject){
            if (EN.CollisionUtils.TestPointIntersect(cPos, cGameObject.Bounds))
            {
                aColliding.push(cGameObject);
            }
        });

        return aColliding;
    }

    Update()
    {
        CollisionGrid.UpdateGrid(this.m_aGameObjects);
        this.__HandleCollisions();
    }

    __HandleCollisions()
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
}

EN.CollisionSystem = new CollisionSystem();
