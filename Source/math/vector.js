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

    this.m_nX = x;
    this.m_nY = y;
    this.m_fOnChange = function(){};
}

Object.defineProperty(Vector.prototype, "x", {
    get: function(){
        return this.m_nX;
    },
    set: function(x){
        var nOldX = this.m_nX;
        this.m_nX = x;
        this.m_fOnChange(x, nOldX, this.m_nY, this.m_nY);
    }
});

Object.defineProperty(Vector.prototype, "y", {
    get: function(){
        return this.m_nY;
    },
    set: function(y){
        var nOldY = this.m_nY;
        this.m_nY = y;
        this.m_fOnChange(this.m_nX, this.m_nX, y, nOldY);
    }
});

Vector.prototype.OnChange = function(fOnChange){
    this.m_fOnChange = fOnChange;
};

/**
 * Below functions operate on current vector
 */
Vector.prototype.Set = function(cVec){
    var nX = this.x;
    var nY = this.y;

    this.m_nX = cVec.x;
    this.m_nY = cVec.y;

    this.m_fOnChange(cVec.x, nX, cVec.y, nY);

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
    var nX = this.x;
    var nY = this.y;

    var nLength = this.Length();
    
    if(nLength !== 0)
    {
        this.m_nX = this.x / nLength;
        this.m_nY = this.y / nLength;

        this.m_fOnChange(this.x, nX, this.y, nY);
    }
    
    return this;
};

Vector.prototype.Add = function(cVec){
    var nX = this.x;
    var nY = this.y;

    this.m_nX += cVec.x;
    this.m_nY += cVec.y;

    this.m_fOnChange(this.x, nX, this.y, nY);

    return this;
};

Vector.prototype.Subtract = function(cVec){
    var nX = this.x;
    var nY = this.y;

    this.m_nX -= cVec.x;
    this.m_nY -= cVec.y;

    this.m_fOnChange(this.x, nX, this.y, nY);
    
    return this;
};

Vector.prototype.ScalarMultiply = function(nScalar){
    var nX = this.x;
    var nY = this.y;

    this.m_nX *= nScalar;
    this.m_nY *= nScalar;

    this.m_fOnChange(this.x, nX, this.y, nY);
    
    return this;
};

Vector.prototype.MatrixMultiply = function(cMat){
    var nX = this.x;
    var nY = this.y;

    this.m_nX = nX * cMat.BaseMatrix[0][0] + nY * cMat.BaseMatrix[1][0] + cMat.BaseMatrix[2][0];
    this.m_nY = nX * cMat.BaseMatrix[0][1] + nY * cMat.BaseMatrix[1][1] + cMat.BaseMatrix[2][1];

    this.m_fOnChange(this.x, nX, this.y, nY);
    
    return this;
};

Vector.prototype.Lerp = function(cVec, nAlpha){
    var nX = this.x;
    var nY = this.y;

    this.m_nX += (cVec.x - this.x) * nAlpha;
    this.m_nY += (cVec.y - this.y) * nAlpha;

    this.m_fOnChange(this.x, nX, this.y, nY);
    
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
