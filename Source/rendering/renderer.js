include("game/camera.js", true);

var Cam = EN.Camera;

EN.Renderer = function(eCanvas){
    var m_eCanvas = eCanvas;
    var m_cCtx = null;
    
    var m_sClearColor = "rgb(0,0,0)";
    
    var m_cTransforMatrix = null;
    var m_cScaleInverseMatrix = null;
    
    function Init()
    {
        m_cCtx = m_eCanvas.getContext("2d");
        
        m_eCanvas.width = window.innerWidth;
        m_eCanvas.height = window.innerHeight;
        
        m_cTransforMatrix = new EN.Matrix();
        
        m_cScaleInverseMatrix = new EN.Matrix();
        m_cScaleInverseMatrix.SetScale(new EN.Vector(1, -1));
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
    
    this.DrawImage = function(cMatrix, cImg, nWidth, nHeight, nImageTop, nImageLeft){
        m_cCtx.save();
        
        m_cTransforMatrix.Reset().Multiply(m_cScaleInverseMatrix).Multiply(cMatrix);
        
        m_cCtx.setTransform.apply(m_cCtx, m_cTransforMatrix.GetCanvasTransform());
        m_cCtx.drawImage(cImg, nImageTop, nImageLeft, nWidth, nHeight, -nWidth / 2, -nHeight / 2, nWidth, nHeight);
        m_cCtx.restore();
    };
    
    this.CreatePattern = function(cImg){
        return m_cCtx.createPattern(cImg, "repeat");
    };
    
    this.DrawTiledImage = function(cPattern, cDrawTransform, nWidth, nHeight){
        var cPos = cDrawTransform.WorldSpace ? Cam.WorldPosToScreenPos(cDrawTransform.Pos) : cDrawTransform.Pos;
        
        m_cCtx.save();
        
        m_cCtx.translate(cPos.x, cPos.y);
        
        m_cCtx.fillStyle = cPattern;
        m_cCtx.fillRect(0, 0, nWidth, nHeight);
        
        m_cCtx.restore();
    };
    
    this.DrawRectangle = function(cDrawTransform, nWidth, nHeight, sColor){
        var cPos = cDrawTransform.WorldSpace ? Cam.WorldPosToScreenPos(cDrawTransform.Pos) : cDrawTransform.Pos;
        
        m_cCtx.fillStyle = sColor;
        m_cCtx.fillRect(cPos.x, cPos.y, nWidth, nHeight);
    };
    
    this.DrawCircle = function(cDrawTransform, nRadius, cColor){
        var cPos = cDrawTransform.WorldSpace ? Cam.WorldPosToScreenPos(cDrawTransform.Pos) : cDrawTransform.Pos;
        
        m_cCtx.fillStyle = cColor.toString();
        m_cCtx.beginPath();
        m_cCtx.arc(cPos.x + nRadius, cPos.y + nRadius, nRadius, 0, Math.PI * 2);
        m_cCtx.closePath();
        m_cCtx.fill();
    };
    
    this.DrawText = function(cDrawTransform, sText, sFont, sColor){
        var cPos = cDrawTransform.WorldSpace ? Cam.WorldPosToScreenPos(cDrawTransform.Pos) : cDrawTransform.Pos;
        
        m_cCtx.textBaseline = "top";
        m_cCtx.textAlign = "left";
        m_cCtx.font = sFont;
        m_cCtx.fillStyle = sColor;
        m_cCtx.fillText(sText, cPos.x, cPos.y);
    };
    
    this.MeasureText = function(sText, sFont){
        m_cCtx.font = sFont;
        return m_cCtx.measureText(sText);
    };
    
    Init();
};

//# sourceURL=engine/rendering/renderer.js