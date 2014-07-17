function Vector()
{
    var x = 0;
    var y = 0;
    
    switch(arguments.length)
    {
        case 0:
            break;
        case 1:
            var cVec = arguments[0];
            
            x = cVec.x;
            y = cVec.y;
            break;
        case 2:
            x = arguments[0];
            y = arguments[1];
            break;
        default:
            throw new Error("Wrong number of arguments passed!");
            break;
    }
    
    this.x = x;
    this.y = y;
}

/**
 * Below functions operate on current vector
 */
Vector.prototype.Set = function(cVec){
    this.x = cVec.x;
    this.y = cVec.y;

    return this;
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
    
    if(nLength !== 0)
    {
        this.x = this.x / nLength;
        this.y = this.y / nLength;
    }
    
    return this;
};

Vector.prototype.Add = function(cVec){
    this.x += cVec.x;
    this.y += cVec.y;
    
    return this;
};

Vector.prototype.Subtract = function(cVec){
    this.x -= cVec.x;
    this.y -= cVec.y;
    
    return this;
};

Vector.prototype.ScalarMultiply = function(nScalar){
    this.x *= nScalar;
    this.y *= nScalar;
    
    return this;
};

Vector.prototype.MatrixMultiply = function(cMat){
    var x = this.x;
    var y = this.y;
    
    this.x = x * cMat.BaseMatrix[0][0] + y * cMat.BaseMatrix[1][0] + cMat.BaseMatrix[2][0];
    this.y = x * cMat.BaseMatrix[0][1] + y * cMat.BaseMatrix[1][1] + cMat.BaseMatrix[2][1];
    
    return this;
};

Vector.prototype.Lerp = function(cVec, nAlpha){
    this.x += (cVec.x - this.x) * nAlpha;
    this.y += (cVec.y - this.y) * nAlpha;
    
    return this;
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

Vector.MatrixMultiply = function(cVec, cMat){
    var x = cVec.x;
    var y = cVec.y;
    
    return new Vector(
        x * cMat.BaseMatrix[0][0] + y * cMat.BaseMatrix[1][0] + cMat.BaseMatrix[2][0],
        x * cMat.BaseMatrix[0][1] + y * cMat.BaseMatrix[1][1] + cMat.BaseMatrix[2][1]
    );
};

Vector.Lerp = function(cVec1, cVec2, nAlpha){
    return new Vector(cVec1.x + (cVec2.x - cVec1.x) * nAlpha, cVec1.y + (cVec2.y - cVec1.y) * nAlpha);
};

EN.Vector = Vector;
//# sourceURL=engine/rendering/vector.js