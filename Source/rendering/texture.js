include("game/camera.js", true);
include("rendering/renderer.js", true);

function Texture(nWidth, nHeight)
{
    this.m_eCanvas = document.createElement("canvas");
    this.m_eCanvas.width = nWidth;
    this.m_eCanvas.height = nHeight;

    this.m_cCamera = new EN.Camera("Texture");
    this.m_cCamera.Init();

    this.m_cCtx = this.m_eCanvas.getContext("2d");

    this.m_cRenderer = new EN.Renderer(this.m_cCtx, nWidth, nHeight, this.m_cCamera);

    this.m_cTransformMatrix = new EN.Matrix();
}

Texture.prototype.DrawImage = function(cPos, cImage){
    this.m_cTransformMatrix.Reset();
    this.m_cTransformMatrix.SetTranslation(cPos);

    this.m_cRenderer.DrawImage(this.m_cTransformMatrix, cImage, cImage.Width, cImage.Height);
};

Texture.prototype.Flip = function(){
    this.m_cCtx.translate(this.m_eCanvas.width / 2, this.m_eCanvas.height / 2);
    this.m_cCtx.scale(1, -1);
};

Texture.prototype.GetTexture = function(){
    return this.m_eCanvas;
};

EN.Texture = Texture;
//# sourceURL=engine/rendering/texture.js