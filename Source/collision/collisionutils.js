/*EN.CollisionUtils = (function(){
    return {
        TestPointIntersect: function(cPos, cCollidable){
            var cBounds = cCollidable.GetBounds();
            
            return !(cPos.x < cBounds.x1 || cPos.x > cBounds.x2 || cPos.y < cBounds.y1 || cPos.y > cBounds.y2);
        },
        TestEntityIntersect: function(cCollidable1, cCollidable2){
            var cBounds1 = cCollidable1.GetBounds();
            var cBounds2 = cCollidable2.GetBounds();

            var bCollision = !(cBounds1.x1 > cBounds2.x2 || cBounds1.y1 > cBounds2.y2 || cBounds1.x2 < cBounds2.x1 || cBounds1.y2 < cBounds2.y1);
            
            return bCollision;
        }
    };
})();*/

var isBetween = EN.Math.IsBetween;

EN.CollisionUtils = {
    TestPointIntersect: function(cPos, cCollidable){
        var cBounds = cCollidable.GetBounds();

        return !(cPos.x < cBounds.MinMax.x1 || cPos.x > cBounds.MinMax.x2 || cPos.y < cBounds.MinMax.y1 || cPos.y > cBounds.MinMax.y2);
    },
    MinMaxOverlap: function (cMinMax1, cMinMax2){
        return isBetween(cMinMax2.min, cMinMax1.min, cMinMax1.max) || isBetween(cMinMax1.min, cMinMax2.min, cMinMax2.max);
    },
    SATTest: function(cAxis, aCorners){
        var cMinMax = {
            min: null,
            max: null
        };

        for(var i = 0 ; i < aCorners.length ; i++)
        {
            var nDot = aCorners[i].Dot(cAxis);

            if (cMinMax.min === null || nDot < cMinMax.min)
            {
                cMinMax.min = nDot;
            }

            if (cMinMax.max === null || nDot > cMinMax.max)
            {
                cMinMax.max = nDot;
            }
        }

        return cMinMax;
    }
};
