//Ref: https://github.com/toji/gl-matrix/blob/master/src/gl-matrix/mat2d.js
include("math/vector.js", true);

var Vec = EN.Vector;

var cos = Math.cos;
var sin = Math.sin;

var c_nDegToRadian = Math.PI / 180;

function Matrix(cMatrix)
{
   this.Reset();

    if (cMatrix)
    {
        this.BaseMatrix[0][0] = cMatrix.BaseMatrix[0][0];
        this.BaseMatrix[0][1] = cMatrix.BaseMatrix[0][1];
        this.BaseMatrix[0][2] = cMatrix.BaseMatrix[0][2];
        this.BaseMatrix[1][0] = cMatrix.BaseMatrix[1][0];
        this.BaseMatrix[1][1] = cMatrix.BaseMatrix[1][1];
        this.BaseMatrix[1][2] = cMatrix.BaseMatrix[1][2];
        this.BaseMatrix[2][0] = cMatrix.BaseMatrix[2][0];
        this.BaseMatrix[2][1] = cMatrix.BaseMatrix[2][1];
        this.BaseMatrix[2][2] = cMatrix.BaseMatrix[2][2];
    }
}

Matrix.prototype.Reset = function(){
    this.BaseMatrix = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ];

    return this;
};

Object.defineProperty(Matrix.prototype, "Position", {
    get: function(){
        return new EN.Vector(this.BaseMatrix[2][0], this.BaseMatrix[2][1]);
    }
});

Matrix.prototype.Translate = function(cVec){
    var cBM = this.BaseMatrix;

    cBM[2][0] = cBM[0][0] * cVec.x + cBM[1][0] * cVec.y + cBM[2][0];
    cBM[2][1] = cBM[0][1] * cVec.x + cBM[1][1] * cVec.y + cBM[2][1];

    return this;
};

Matrix.prototype.SetTranslation = function(cVector){
    this.BaseMatrix[2][0] = cVector.x;
    this.BaseMatrix[2][1] = cVector.y;
    
    return this;
};

Matrix.prototype.Rotate = function(nDegrees){
    var nRadians = nDegrees * c_nDegToRadian;

    var nCos = cos(nRadians);
    var nSine = sin(nRadians);

    var cBM = this.BaseMatrix;

    var a = cBM[0][0] * nCos + cBM[1][0] * nSine;
    var b = cBM[0][1] * nCos + cBM[1][1] * nSine;
    var c = cBM[0][0] * -nSine + cBM[1][0] * nCos;
    var d = cBM[0][1] * -nSine + cBM[1][1] * nCos;

    cBM[0][0] = a;
    cBM[0][1] = b;
    cBM[1][0] = c;
    cBM[1][1] = d;

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

Matrix.prototype.Scale = function(cScale){
    var cBM = this.BaseMatrix;

    cBM[0][0] = cBM[0][0] * cScale.x;
    cBM[0][1] = cBM[0][1] * cScale.x;
    cBM[1][0] = cBM[1][0] * cScale.y;
    cBM[1][1] = cBM[1][1] * cScale.y;

    return this;
};

Matrix.prototype.Multiply = function(cMatrix){
    var cLBM = this.BaseMatrix;
    var cRBM = cMatrix.BaseMatrix;
    
    var a = cLBM[0][0] * cRBM[0][0] + cLBM[0][1] * cRBM[1][0];
    var b = cLBM[0][0] * cRBM[0][1] + cLBM[0][1] * cRBM[1][1];
    var c = cLBM[1][0] * cRBM[0][0] + cLBM[1][1] * cRBM[1][0];
    var d = cLBM[1][0] * cRBM[0][1] + cLBM[1][1] * cRBM[1][1];
    var e = cLBM[2][0] * cRBM[0][0] + cLBM[2][1] * cRBM[1][0] + cRBM[2][0];
    var f = cLBM[2][0] * cRBM[0][1] + cLBM[2][1] * cRBM[1][1] + cRBM[2][1];
    
    cLBM[0][0] = a;
    cLBM[0][1] = b;
    cLBM[1][0] = c;
    cLBM[1][1] = d;
    cLBM[2][0] = e;
    cLBM[2][1] = f;
    
    return this;
};

Matrix.prototype.Inverse = function(){
    return Matrix.Inverse(this);
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

// REF: http://stackoverflow.com/questions/983999/simple-3x3-matrix-inverse-code-c

Matrix.Inverse = function(cMatrix){
    var cBM = cMatrix.BaseMatrix;
    
    var nDeterminate = 
        cBM[0][0] * (cBM[1][1] * cBM[2][2] - cBM[2][1] * cBM[1][2]) -
        cBM[0][1] * (cBM[1][0] * cBM[2][2] - cBM[1][2] * cBM[2][0]) +
        cBM[0][2] * (cBM[1][0] * cBM[2][1] - cBM[1][1] * cBM[2][0]);

    var nInvDet = 1 / nDeterminate;
    
    var cInverseMatrix = new Matrix();
    
    cInverseMatrix.BaseMatrix[0][0] = (cBM[1][1] * cBM[2][2] - cBM[2][1] * cBM[1][2]) * nInvDet;
    cInverseMatrix.BaseMatrix[0][1] = (cBM[0][2] * cBM[2][1] - cBM[0][1] * cBM[2][2]) * nInvDet;
    cInverseMatrix.BaseMatrix[0][2] = (cBM[0][1] * cBM[1][2] - cBM[0][2] * cBM[1][1]) * nInvDet;
    cInverseMatrix.BaseMatrix[1][0] = (cBM[1][2] * cBM[2][0] - cBM[1][0] * cBM[2][2]) * nInvDet;
    cInverseMatrix.BaseMatrix[1][1] = (cBM[0][0] * cBM[2][2] - cBM[0][2] * cBM[2][0]) * nInvDet;
    cInverseMatrix.BaseMatrix[1][2] = (cBM[1][0] * cBM[0][2] - cBM[0][0] * cBM[1][2]) * nInvDet;
    cInverseMatrix.BaseMatrix[2][0] = (cBM[1][0] * cBM[2][1] - cBM[2][0] * cBM[1][1]) * nInvDet;
    cInverseMatrix.BaseMatrix[2][1] = (cBM[2][0] * cBM[0][1] - cBM[0][0] * cBM[2][1]) * nInvDet;
    cInverseMatrix.BaseMatrix[2][2] = (cBM[0][0] * cBM[1][1] - cBM[1][0] * cBM[0][1]) * nInvDet;
    
    return cInverseMatrix;                    
};

EN.Matrix = Matrix;
