EN.CollisionUtils = (function(){
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
})();
