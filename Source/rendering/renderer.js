include("game/cameramanager.js", true);

var CM = EN.CameraManager;

EN.Renderer = function(eCanvas){
    var m_eCanvas = eCanvas;
    var m_cCtx = null;
    
    var m_cClearColor = new EN.Color();
    
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
        m_cCtx.fillStyle = m_cClearColor.toString();
        m_cCtx.fillRect(0, 0, m_eCanvas.width, m_eCanvas.height);
    };
    
    this.SetClearColor = function(cColor){
        m_cClearColor = cColor;
    };
    
    this.DrawImage = function(cMatrix, cImg, nWidth, nHeight, cOffset, nAlpha){
        m_cCtx.save();
        
        m_cTransforMatrix.Reset().Multiply(m_cScaleInverseMatrix).Multiply(cMatrix).Multiply(CM.GetCamera().GetTransformMatrix());
        
        m_cCtx.setTransform.apply(m_cCtx, m_cTransforMatrix.GetCanvasTransform());
        m_cCtx.globalAlpha = nAlpha;
        m_cCtx.drawImage(cImg, cOffset.x, cOffset.y, nWidth, nHeight, -nWidth / 2, -nHeight / 2, nWidth, nHeight);
        m_cCtx.restore();
    };
    
    this.CreatePattern = function(cImg){
        return m_cCtx.createPattern(cImg, "repeat");
    };
    
    this.DrawTiledImage = function(cMatrix, cPattern, nWidth, nHeight, cOffset, nAlpha){
        m_cCtx.save();
        
        m_cTransforMatrix.Reset().Multiply(m_cScaleInverseMatrix).Multiply(cMatrix).Multiply(CM.GetCamera().GetTransformMatrix());
        
        m_cCtx.setTransform.apply(m_cCtx, m_cTransforMatrix.GetCanvasTransform());
        m_cCtx.translate((-nWidth / 2) - cOffset.x, (-nHeight / 2) - cOffset.y);
        
        m_cCtx.fillStyle = cPattern;
        m_cCtx.globalAlpha = nAlpha;
        m_cCtx.fillRect(cOffset.x, cOffset.y, nWidth, nHeight);
        
        m_cCtx.restore();
    };
    
    this.DrawRectangle = function(cMatrix, nWidth, nHeight, cColor){
        m_cCtx.save();
        
        m_cTransforMatrix.Reset().Multiply(m_cScaleInverseMatrix).Multiply(cMatrix).Multiply(CM.GetCamera().GetTransformMatrix());
        
        m_cCtx.setTransform.apply(m_cCtx, m_cTransforMatrix.GetCanvasTransform());
        m_cCtx.translate(-nWidth / 2, -nHeight / 2);
        
        m_cCtx.fillStyle = cColor.toString();
        m_cCtx.fillRect(0, 0, nWidth, nHeight);
        
        m_cCtx.restore();
    };
    
    this.DrawCircle = function(cMatrix, nRadius, cColor){
        m_cCtx.save();
        
        m_cTransforMatrix.Reset().Multiply(m_cScaleInverseMatrix).Multiply(cMatrix).Multiply(CM.GetCamera().GetTransformMatrix());
        m_cCtx.setTransform.apply(m_cCtx, m_cTransforMatrix.GetCanvasTransform());
        
        m_cCtx.fillStyle = cColor.toString();
        m_cCtx.beginPath();
        m_cCtx.arc(0, 0, nRadius, 0, Math.PI * 2);
        m_cCtx.closePath();
        m_cCtx.fill();
        
        m_cCtx.restore();
    };
    
    this.DrawShape = function(cMatrix, aPoints, cColor){
        m_cCtx.save();
        
        m_cTransforMatrix.Reset().Multiply(m_cScaleInverseMatrix).Multiply(cMatrix).Multiply(CM.GetCamera().GetTransformMatrix());
        m_cCtx.setTransform.apply(m_cCtx, m_cTransforMatrix.GetCanvasTransform());
        
        m_cCtx.beginPath();
        
        m_cCtx.moveTo(aPoints[aPoints.length - 1].x, aPoints[aPoints.length - 1].y);
        
        for (var i = 0; i < aPoints.length; i++)
        {
            m_cCtx.lineTo(aPoints[i].x, aPoints[i].y);
        }
        
        m_cCtx.lineWidth = 0.01;
        m_cCtx.strokeStyle = cColor.toString();
        m_cCtx.stroke();
        
        m_cCtx.restore();
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