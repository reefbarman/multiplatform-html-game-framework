var CollisionUtils = (function(){
    return {
        TestPointIntersect: function(cPos, cEntity){
            var cEntityPos = cEntity.Pos;
            
            return !(cPos.x < cEntityPos.x || cPos.x > (cEntityPos.x + cEntity.Width) || cPos.y < cEntityPos.y || cPos.y > (cEntityPos.y + cEntity.Height));
        }
    };
})();

//# sourceURL=collision/collisionutils.js