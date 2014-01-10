function Vector(x, y)
{
    this.x = x;
    this.y = y;
}

Vector.prototype.Equals = function(cVec){
    return this.x == cVec.x && this.y == cVec.y;
};

Vector.prototype.Length = function(){
    return Math.sqrt(this.Dot(this));
};

Vector.prototype.Add = function(cVec){
    return new Vector(this.x + cVec.x, this.y + cVec.y);
};

Vector.prototype.Subtract = function(cVec){
    return new Vector(this.x - cVec.x, this.y - cVec.y);
};

Vector.prototype.ScalarMultiply = function(nScalar){
    return new Vector(this.x * nScalar, this.y * nScalar);
};

Vector.prototype.Dot = function(cVec){
    return this.x * cVec.x + this.y * cVec.y;
};

Vector.prototype.Normalize = function(){
    var nLength = this.Length();
    
    this.x = this.x / nLength;
    this.y = this.y / nLength;
};

//# sourceURL=rendering/vector.js