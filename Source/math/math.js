var random = Math.random;

EN.Math = {
    Random: function(nMin, nMax){
        return random() * (nMax - nMin) + nMin;
    }
};

//# sourceURL=engine/math/math.js