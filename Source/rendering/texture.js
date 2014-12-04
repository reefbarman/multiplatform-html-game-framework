function Texture(nWidth, nHeight)
{
    this.m_eCanvas = document.createElement("canvas");
    this.m_eCanvas.width = nWidth;
    this.m_eCanvas.height = nHeight;

    this.m_cCtx = this.m_eCanvas.getContext("2d");
}

Texture.prototype.DrawImage = function(cPos, cImage){
    if (cImage instanceof  EN.ImageAsset)
    {
        cImage = cImage.BaseImage;
    }

    this.m_cCtx.drawImage(cImage, cPos.x, cPos.y);
};

Texture.prototype.GetTexture = function(){
    return this.m_eCanvas;
};

EN.Texture = Texture;
//# sourceURL=engine/rendering/texture.js