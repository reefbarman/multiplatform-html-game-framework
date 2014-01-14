function Renderer(eCanvas)
{
    var m_eCanvas = eCanvas;
    var m_cCtx = null;
    
    var m_sClearColor = "rgb(0,0,0)";
    
    function Init()
    {
        m_cCtx = m_eCanvas.getContext("2d");
        
        m_eCanvas.width = window.innerWidth;
        m_eCanvas.height = window.innerHeight;
    }
    
    this.GetRawContext = function(){
        return m_cCtx;
    };
    
    this.Clear = function(){
        m_cCtx.fillStyle = m_sClearColor;
        m_cCtx.fillRect(0, 0, m_eCanvas.width, m_eCanvas.height);
    };
    
    this.SetClearColor = function(sColor){
        m_sClearColor = sColor;
    };
    
    this.DrawImage = function(cImg, cPos, nWidth, nHeight, nImageTop, nImageLeft, nScale){
        var cScreenPos = Camera.WorldPosToScreenPos(cPos);
        
        m_cCtx.save();
        m_cCtx.scale(nScale, nScale);
        m_cCtx.drawImage(cImg, nImageTop, nImageLeft, nWidth, nHeight, cScreenPos.x * (1 / nScale), cScreenPos.y * (1 / nScale), nWidth, nHeight);
        m_cCtx.restore();
    };
    
    this.CreatePattern = function(cImg){
        return m_cCtx.createPattern(cImg, "repeat");
    };
    
    this.DrawTiledImage = function(cPattern, cPos, cOffset, nWidth, nHeight){
        /* To deal with the fact that a repeating image will always start at the bounds of the canvas
         * No Matter where you tell it to draw from. We have to translate the canvas by the distance
         * the camera is from World 0,0 and then add that much length to the rect we are drawing to
         * compensate for the translation.
         */
        /*var cScreenPos = m_cCamera.WorldPosToScreenPos(cPos);
        
        m_cCtx.save();
        
        var cCameraPos = m_cCamera.Pos;
        
        m_cCtx.translate(-cCameraPos.x, -cCameraPos.y);
        
        m_cCtx.fillStyle = cPattern;
        m_cCtx.fillRect(cScreenPos.x, cScreenPos.y, nWidth + cCameraPos.x, nHeight + cCameraPos.y);
        
        m_cCtx.restore();*/
        
        var cScreenPos = Camera.WorldPosToScreenPos(cPos);
        
        m_cCtx.save();
        
        m_cCtx.translate(cScreenPos.x, cScreenPos.y);
        
        m_cCtx.fillStyle = cPattern;
        m_cCtx.fillRect(0, 0, nWidth, nHeight);
        
        m_cCtx.restore();
    };
    
    this.DrawRectangle = function(cPos, nWidth, nHeight, sColor){
        var cScreenPos = Camera.WorldPosToScreenPos(cPos);
        
        m_cCtx.fillStyle = sColor;
        m_cCtx.fillRect(cScreenPos.x, cScreenPos.y, nWidth, nHeight);
    };
    
    this.DrawCircle = function(cPos, nRadius, sColor){
        var cScreenPos = Camera.WorldPosToScreenPos(cPos);
        
        m_cCtx.beginPath();
        m_cCtx.fillStyle = sColor;
        m_cCtx.arc(cScreenPos.x + nRadius, cScreenPos.y + nRadius, nRadius, 0, Math.PI * 2);
        m_cCtx.fill();
    };
    
    this.DrawText = function(cPos, sText, sFont, sColor){
        var cScreenPos = Camera.WorldPosToScreenPos(cPos);
        
        m_cCtx.textBaseline = "top";
        m_cCtx.textAlign = "left";
        m_cCtx.font = sFont;
        m_cCtx.fillStyle = sColor;
        m_cCtx.fillText(sText, cScreenPos.x, cScreenPos.y);
    };
    
    this.MeasureText = function(sText, sFont){
        m_cCtx.font = sFont;
        return m_cCtx.measureText(sText);
    };
    
    Init();
}

//# sourceURL=rendering/renderer.js