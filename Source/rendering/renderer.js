include("game/cameramanager.js", true);
include("rendering/color.js", true);

var CM = EN.CameraManager;

EN.Renderer = function(cCtx, nWidth, nHeight, cCamera){
    var m_cCtx = cCtx;
    var m_nWidth = nWidth;
    var m_nHeight = nHeight;
    var m_cCamera = cCamera;
    
    var m_cClearColor = new EN.Color();
    
    var m_cTransforMatrix = null;
    var m_cScaleInverseMatrix = null;
    
    function Init()
    {
        m_cCtx.imageSmoothingEnabled = false;
        
        m_cTransforMatrix = new EN.Matrix();
        
        m_cScaleInverseMatrix = new EN.Matrix();
        m_cScaleInverseMatrix.SetScale(new EN.Vector(1, -1));
    }

    function GetCamera()
    {
        var cCamera = m_cCamera;

        if (!cCamera)
        {
            cCamera = CM.GetCamera();
        }

        return cCamera;
    }
    
    function GetColor(color)
    {
        if (color instanceof EN.Color)
        {
            color = color.toString();
        }
        
        return color;
    }
    
    this.GetRawContext = function(){
        return m_cCtx;
    };
    
    this.Clear = function(){
        m_cCtx.fillStyle = m_cClearColor.toString();
        m_cCtx.fillRect(0, 0, m_nWidth, m_nHeight);
    };
    
    this.SetClearColor = function(cColor){
        m_cClearColor = cColor;
    };
    
    this.DrawImage = function(cMatrix, cImage, nWidth, nHeight, cAnchor, nAlpha){
        cAnchor = cAnchor ? cAnchor : { x: 0, y: 0 };
        nAlpha = typeof nAlpha != "undefined" ? nAlpha : 1;

        m_cCtx.save();
        
        var cCamera = GetCamera();
        
        m_cTransforMatrix.Reset();
        
        if (cCamera.Cartesian)
        {
            m_cTransforMatrix.Multiply(m_cScaleInverseMatrix);
        } 
        
        m_cTransforMatrix.Multiply(cMatrix).Multiply(EN.Game.Viewport.GetTransformMatrix()).Multiply(cCamera.GetTransformMatrix());
        
        m_cCtx.setTransform.apply(m_cCtx, m_cTransforMatrix.GetCanvasTransform());
        m_cCtx.globalAlpha = nAlpha;

        var cBaseImage = cImage;

        if (cImage instanceof EN.ImageAsset)
        {
            cBaseImage = cImage.BaseImage;
        }
        else if (cImage instanceof EN.Texture)
        {
            cBaseImage = cImage.GetTexture();
        }

        var nXBasePos = -nWidth * cAnchor.x;
        var nYBasePos = -nHeight * (1 - cAnchor.y);

        m_cCtx.drawImage(cBaseImage, 0, 0, cBaseImage.width, cBaseImage.height, nXBasePos, nYBasePos, nWidth, nHeight);
        m_cCtx.restore();
    };
    
    this.CreatePattern = function(cImg){
        return m_cCtx.createPattern(cImg, "repeat");
    };
    
    this.CreateLinearGradient = function(cStart, cEnd, cColorStops){
        var cGradient = m_cCtx.createLinearGradient(cStart.x, cStart.y, cEnd.x, cEnd.y);
        
        for (var nStopPos in cColorStops)
        {
            cGradient.addColorStop(nStopPos, GetColor(cColorStops[nStopPos]));
        }
        
        return cGradient;
    };
    
    this.DrawTiledImage = function(cMatrix, cPattern, nWidth, nHeight, cOffset, nAlpha){
        m_cCtx.save();
        
        var cCamera = GetCamera();
        
        m_cTransforMatrix.Reset();
        
        if (cCamera.Cartesian)
        {
            m_cTransforMatrix.Multiply(m_cScaleInverseMatrix);
        }
        
        m_cTransforMatrix.Multiply(cMatrix).Multiply(EN.Game.Viewport.GetTransformMatrix()).Multiply(cCamera.GetTransformMatrix());
        
        m_cCtx.setTransform.apply(m_cCtx, m_cTransforMatrix.GetCanvasTransform());
        m_cCtx.translate((-nWidth / 2) - cOffset.x, (-nHeight / 2) - cOffset.y);
        
        m_cCtx.fillStyle = cPattern;
        m_cCtx.globalAlpha = nAlpha;
        m_cCtx.fillRect(cOffset.x, cOffset.y, nWidth, nHeight);
        
        m_cCtx.restore();
    };
    
    this.DrawRectangle = function(cMatrix, nWidth, nHeight, color, cAnchor){
        cAnchor = cAnchor ? cAnchor : { x: 0, y: 0 };

        m_cCtx.save();
        
        var cCamera = GetCamera();
        
        m_cTransforMatrix.Reset();
        
        if (cCamera.Cartesian)
        {
            m_cTransforMatrix.Multiply(m_cScaleInverseMatrix);
        } 
        
        m_cTransforMatrix.Multiply(cMatrix).Multiply(EN.Game.Viewport.GetTransformMatrix()).Multiply(cCamera.GetTransformMatrix());
        
        m_cCtx.setTransform.apply(m_cCtx, m_cTransforMatrix.GetCanvasTransform());

        m_cCtx.translate(-nWidth * cAnchor.x, -nHeight * (1  - cAnchor.y));
        
        m_cCtx.fillStyle = GetColor(color);
        m_cCtx.fillRect(0, 0, nWidth, nHeight);
        
        m_cCtx.restore();
    };
    
    this.DrawCircle = function(cMatrix, nRadius, color){
        m_cCtx.save();
        
        var cCamera = GetCamera();
        
        m_cTransforMatrix.Reset();
        
        if (cCamera.Cartesian)
        {
            m_cTransforMatrix.Multiply(m_cScaleInverseMatrix);
        } 
        
        m_cTransforMatrix.Multiply(cMatrix).Multiply(EN.Game.Viewport.GetTransformMatrix()).Multiply(cCamera.GetTransformMatrix());
        
        m_cCtx.setTransform.apply(m_cCtx, m_cTransforMatrix.GetCanvasTransform());
        
        m_cCtx.fillStyle = GetColor(color);
        m_cCtx.beginPath();
        m_cCtx.arc(0, 0, nRadius, 0, Math.PI * 2);
        m_cCtx.closePath();
        m_cCtx.fill();
        
        m_cCtx.restore();
    };
    
    this.DrawShape = function(cMatrix, aPoints, color){
        m_cCtx.save();
        
        var cCamera = GetCamera();
        
        m_cTransforMatrix.Reset();
        
        if (cCamera.Cartesian)
        {
            m_cTransforMatrix.Multiply(m_cScaleInverseMatrix);
        } 
        
        m_cTransforMatrix.Multiply(cMatrix).Multiply(EN.Game.Viewport.GetTransformMatrix()).Multiply(cCamera.GetTransformMatrix());
        
        m_cCtx.setTransform.apply(m_cCtx, m_cTransforMatrix.GetCanvasTransform());
        
        m_cCtx.beginPath();
        
        m_cCtx.moveTo(aPoints[aPoints.length - 1].x, aPoints[aPoints.length - 1].y);
        
        for (var i = 0; i < aPoints.length; i++)
        {
            m_cCtx.lineTo(aPoints[i].x, aPoints[i].y);
        }
        
        m_cCtx.lineWidth = 0.1;
        m_cCtx.strokeStyle = GetColor(color);
        m_cCtx.stroke();
        
        m_cCtx.restore();
    };
    
    this.DrawLine = function(cMatrix, cStart, cEnd, color, nLineWidth){
        m_cCtx.save();
        
        var cCamera = GetCamera();

        m_cTransforMatrix.Reset();

        if (cCamera.Cartesian)
        {
            m_cTransforMatrix.Multiply(m_cScaleInverseMatrix);
        }

        m_cTransforMatrix.Multiply(cMatrix).Multiply(EN.Game.Viewport.GetTransformMatrix()).Multiply(cCamera.GetTransformMatrix());

        m_cCtx.setTransform.apply(m_cCtx, m_cTransforMatrix.GetCanvasTransform());
        
        m_cCtx.beginPath();

        //TODO this is well hacky figure out a better way of dealing with the cartesian weirdness
        //Prob works if parent is axis aligned but rotation will prob break it
        m_cCtx.moveTo(cStart.x, cStart.y * (cCamera.Cartesian ? -1 : 1));
        m_cCtx.lineTo(cEnd.x, cEnd.y * (cCamera.Cartesian ? -1 : 1));
        
        m_cCtx.lineWidth = typeof nLineWidth != "undefined" ? nLineWidth : 1;
        m_cCtx.strokeStyle = GetColor(color);
        m_cCtx.stroke();
        
        m_cCtx.restore();
    };
    
    this.DrawText = function(cMatrix, sText, sFont, color, aAlignment){
        m_cCtx.save();
        
        var cCamera = GetCamera();
        
        m_cTransforMatrix.Reset();
        
        if (cCamera.Cartesian)
        {
            m_cTransforMatrix.Multiply(m_cScaleInverseMatrix);
        } 
        
        m_cTransforMatrix.Multiply(cMatrix).Multiply(EN.Game.Viewport.GetTransformMatrix()).Multiply(cCamera.GetTransformMatrix());
        
        m_cCtx.setTransform.apply(m_cCtx, m_cTransforMatrix.GetCanvasTransform());
        
        aAlignment = aAlignment || ["middle", "center"];
        
        m_cCtx.textBaseline = aAlignment[0];
        m_cCtx.textAlign = aAlignment[1];
        m_cCtx.font = sFont;
        
        m_cCtx.fillStyle = GetColor(color);
        m_cCtx.fillText(sText, 0, 0);
        
        m_cCtx.restore();
    };
    
    this.MeasureText = function(sText, sFont){
        m_cCtx.font = sFont;
        return m_cCtx.measureText(sText);
    };
    
    Init();
};

//# sourceURL=engine/rendering/renderer.js