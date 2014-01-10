var CollisionUtils = (function(){
    return {
        TestPointIntersect: function(cPos, cEntity){
            var cEntityPos = cEntity.Pos;
            
            return !(cPos.x < cEntityPos.x || cPos.x > (cEntityPos.x + cEntity.Width) || cPos.y < cEntityPos.y || cPos.y > (cEntityPos.y + cEntity.Height));
        },
        TestEntityIntersect: function(cEntity1, cEntity2){
            var cPos1 = cEntity1.Pos;
            var cPos2 = cEntity2.Pos;
            
            return (!(cPos1.x > (cPos2.x + cEntity2.Width) || cPos1.y > (cPos2.y + cEntity2.Height) || (cPos1.x + cEntity1.Width) < cPos2.x || (cPos1.y + cEntity1.Height) < cPos2.y));
        }
    };
})();

//# sourceURL=collision/collisionutils.js