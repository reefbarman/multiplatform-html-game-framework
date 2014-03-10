var cos = Math.cos;
var sin = Math.sin;

var c_nDegToRadian = Math.PI / 180;

function Matrix()
{
   this.Reset();
}

Matrix.prototype.Reset = function(){
    this.BaseMatrix = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ];
    
    return this;
};

Matrix.prototype.SetTranslation = function(cVector){
    this.BaseMatrix[2][0] = cVector.x;
    this.BaseMatrix[2][1] = cVector.y;
    
    return this;
};

Matrix.prototype.SetRotation = function(nDegrees){
    var nRadians = nDegrees * c_nDegToRadian;
    
    var nCos = cos(nRadians);
    var nSine = sin(nRadians);
    
    this.BaseMatrix[0][0] = nCos;
    this.BaseMatrix[0][1] = nSine;
    this.BaseMatrix[1][0] = -nSine;
    this.BaseMatrix[1][1] = nCos;
    
    return this;
};

Matrix.prototype.SetScale = function(cScaleVec){
    this.BaseMatrix[0][0] = cScaleVec.x;
    this.BaseMatrix[1][1] = cScaleVec.y;
    
    return this;
};

Matrix.prototype.Multiply = function(cMatrix){
    var a = this.BaseMatrix[0][0] * cMatrix.BaseMatrix[0][0] + this.BaseMatrix[0][1] * cMatrix.BaseMatrix[1][0];
    var b = this.BaseMatrix[0][0] * cMatrix.BaseMatrix[0][1] + this.BaseMatrix[0][1] * cMatrix.BaseMatrix[1][1];
    var c = this.BaseMatrix[1][0] * cMatrix.BaseMatrix[0][0] + this.BaseMatrix[1][1] * cMatrix.BaseMatrix[1][0];
    var d = this.BaseMatrix[1][0] * cMatrix.BaseMatrix[0][1] + this.BaseMatrix[1][1] * cMatrix.BaseMatrix[1][1];
    var e = this.BaseMatrix[2][0] * cMatrix.BaseMatrix[0][0] + this.BaseMatrix[2][1] * cMatrix.BaseMatrix[1][0] + cMatrix.BaseMatrix[2][0];
    var f = this.BaseMatrix[2][0] * cMatrix.BaseMatrix[0][1] + this.BaseMatrix[2][1] * cMatrix.BaseMatrix[1][1] + cMatrix.BaseMatrix[2][1];
    
    this.BaseMatrix[0][0] = a;
    this.BaseMatrix[0][1] = b;
    this.BaseMatrix[1][0] = c;
    this.BaseMatrix[1][1] = d;
    this.BaseMatrix[2][0] = e;
    this.BaseMatrix[2][1] = f;
    
    return this;
};

Matrix.prototype.GetCanvasTransform = function(){
    return [
        this.BaseMatrix[0][0],
        this.BaseMatrix[0][1],
        this.BaseMatrix[1][0],
        this.BaseMatrix[1][1],
        this.BaseMatrix[2][0],
        this.BaseMatrix[2][1]
    ];
};

/*********************************
 * Static functions
 *********************************/

Matrix.Multiply = function(cMatrix1, cMatrix2){
    var cNewMatrix = new Matrix();
    
    var a = cMatrix1.BaseMatrix[0][0] * cMatrix2.BaseMatrix[0][0] + cMatrix1.BaseMatrix[0][1] * cMatrix2.BaseMatrix[1][0];
    var b = cMatrix1.BaseMatrix[0][0] * cMatrix2.BaseMatrix[0][1] + cMatrix1.BaseMatrix[0][1] * cMatrix2.BaseMatrix[1][1];
    var c = cMatrix1.BaseMatrix[1][0] * cMatrix2.BaseMatrix[0][0] + cMatrix1.BaseMatrix[1][1] * cMatrix2.BaseMatrix[1][0];
    var d = cMatrix1.BaseMatrix[1][0] * cMatrix2.BaseMatrix[0][1] + cMatrix1.BaseMatrix[1][1] * cMatrix2.BaseMatrix[1][1];
    var e = cMatrix1.BaseMatrix[2][0] * cMatrix2.BaseMatrix[0][0] + cMatrix1.BaseMatrix[2][1] * cMatrix2.BaseMatrix[1][0] + cMatrix2.BaseMatrix[2][0];
    var f = cMatrix1.BaseMatrix[2][0] * cMatrix2.BaseMatrix[0][1] + cMatrix1.BaseMatrix[2][1] * cMatrix2.BaseMatrix[1][1] + cMatrix2.BaseMatrix[2][1];
    
    cNewMatrix.BaseMatrix[0][0] = a;
    cNewMatrix.BaseMatrix[0][1] = b;
    cNewMatrix.BaseMatrix[1][0] = c;
    cNewMatrix.BaseMatrix[1][1] = d;
    cNewMatrix.BaseMatrix[2][0] = e;
    cNewMatrix.BaseMatrix[2][1] = f;
    
    return cNewMatrix;
};

EN.Matrix = Matrix;
//# sourceURL=engine/math/matrix.js