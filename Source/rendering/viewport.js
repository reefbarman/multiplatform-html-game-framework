include("math/vector.js", true);
include("math/matrix.js", true);

var floor = Math.floor;

function Viewport()
{
    this.m_cScale = new EN.Vector(1, 1);
    this.m_cTransformMatrix = new EN.Matrix();
    
    this.Width = EN.Device.Width / this.m_cScale.x;
    this.Height = EN.Device.Height / this.m_cScale.y;
}

Object.defineProperty(Viewport.prototype, "Scale", {
   get: function(){
       return this.m_cScale;
   },
   set: function(cScale){
       this.m_cScale = cScale;
       
       this.Width = floor(EN.Device.Width / this.m_cScale.x);
       this.Height = floor(EN.Device.Height / this.m_cScale.y);
       
       this.m_cTransformMatrix.Reset().Scale(this.m_cScale);
   }
});

Object.defineProperty(Viewport.prototype, "GlobalTransform", {
    get: function(){
        return this.m_cTransformMatrix;
    }
});

EN.Viewport = Viewport;
