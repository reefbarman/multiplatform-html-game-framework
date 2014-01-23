function Vector(x, y)
{
    this.x = x;
    this.y = y;
}

/**
 * Below functions operate on current vector
 */
Vector.prototype.Set = function(cVec){
    this.x = cVec.x;
    this.y = cVec.y;
};

Vector.prototype.Equals = function(cVec){
    return this.x == cVec.x && this.y == cVec.y;
};

Vector.prototype.Length = function(){
    return Math.sqrt(this.Dot(this));
};

Vector.prototype.Dot = function(cVec){
    return this.x * cVec.x + this.y * cVec.y;
};

Vector.prototype.Normalize = function(){
    var nLength = this.Length();
    
    this.x = this.x / nLength;
    this.y = this.y / nLength;
};

Vector.prototype.Add = function(cVec){
    this.x += cVec.x;
    this.y += cVec.y;
};

Vector.prototype.Subtract = function(cVec){
    this.x -= cVec.x;
    this.y -= cVec.y;
};

Vector.prototype.ScalarMultiply = function(nScalar){
    this.x *= nScalar;
    this.y *= nScalar;
};

Vector.prototype.Lerp = function(cVec, nAlpha){
    this.x += (cVec.x - this.x) * nAlpha;
    this.y += (cVec.y - this.y) * nAlpha;
};

/**
 * Below functions will are static and will return a new vector
 */

Vector.Add = function(cVec1, cVec2){
    return new Vector(cVec1.x + cVec2.x, cVec1.y + cVec2.y);
};

Vector.Subtract = function(cVec1, cVec2){
    return new Vector(cVec1.x - cVec2.x, cVec1.y - cVec2.y);
};

Vector.ScalarMultiply = function(cVec, nScalar){
    return new Vector(cVec.x * nScalar, cVec.y * nScalar);
};

Vector.Lerp = function(cVec1, cVec2, nAlpha){
    return new Vector(cVec1.x + (cVec2.x - cVec1.x) * nAlpha, cVec1.y + (cVec2.y - cVec1.y) * nAlpha);
};

EN.Vector = Vector;
//# sourceURL=engine/rendering/vector.js