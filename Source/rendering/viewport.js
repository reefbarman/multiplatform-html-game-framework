include("math/vector.js", true);
include("math/matrix.js", true);

var floor = Math.floor;

function Viewport()
{
    this.m_cTransformMatrix = new EN.Matrix();
    
    this.Width = EN.Device.Width;
    this.Height = EN.Device.Height;
}

EN.Viewport = Viewport;
