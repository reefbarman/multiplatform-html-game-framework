include("math/vector.js", true);
include("math/matrix.js", true);

function Viewport()
{
    this.m_cScale = new EN.Vector(1, 1);
    this.m_cTransformMatrix = new EN.Matrix();
    this.m_cTransformMatrix.SetScale(this.m_cScale);
    
    this.Width = EN.device.width / this.m_cScale.x;
    this.Height = EN.device.height / this.m_cScale.y;
}

Object.defineProperty(Viewport.prototype, "Scale", {
   get: function(){
       return this.m_cScale;
   },
   set: function(cScale){
       this.m_cScale = cScale;
       
       this.Width = EN.device.width / this.m_cScale.x;
       this.Height = EN.device.height / this.m_cScale.y;
       
       this.m_cTransformMatrix.Reset().SetScale(this.m_cScale);
   }
});

Viewport.prototype.GetTransformMatrix = function(){
    return this.m_cTransformMatrix;
};

EN.Viewport = Viewport;
//# sourceURL=engine/rendering/viewport.js
