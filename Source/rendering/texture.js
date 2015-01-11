include("game/camera.js", true);
include("rendering/renderer.js", true);

function Texture(nCanvasWidth, nCanvasHeight)
{
    this._ImageAsset();
    this.m_eCanvas = document.createElement("canvas");
    this.m_eCanvas.width = nCanvasWidth;
    this.m_eCanvas.height = nCanvasHeight;

    this.ImageWidth = nCanvasWidth;
    this.ImageHeight = nCanvasHeight;

    this.m_cCamera = new EN.Camera("Texture");
    this.m_cCamera.Init(nCanvasHeight);

    this.m_cCtx = this.m_eCanvas.getContext("2d");

    this.m_cRenderer = new EN.Renderer(this.m_cCtx, nCanvasWidth, nCanvasHeight, this.m_cCamera);

    this.m_bLoaded = true;
}

inherits(Texture, EN.ImageAsset);

Texture.prototype.DrawImage = function(cImage){
    this.m_cRenderer.DrawImage(cImage);
};

Texture.prototype.GetImage = function(){
    return this.m_eCanvas;
};

EN.Texture = Texture;
