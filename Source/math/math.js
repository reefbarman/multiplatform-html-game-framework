var random = Math.random;
var max = Math.max;
var min = Math.min;

EN.Math = {
    Random: function(nMin, nMax){
        return random() * (nMax - nMin) + nMin;
    },
    Clamp: function (nValue, nMin, nMax){
        return max(min(nMax, nValue), nMin);
    },
    IsBetween: function(nValue, nLowerBounds, nUpperBounds){
        return nLowerBounds <= nValue && nValue <= nUpperBounds;
    }
};
