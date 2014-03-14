//TODO reference counting and deleting images when all reference are given up

EN.AssetManager = (function(){
    var m_cImages = {};
    
    return {
        LoadImage: function(sUrl, fOnLoad){
            var cImage = null;
            
            if (isset(m_cImages[sUrl]))
            {
                cImage = m_cImages[sUrl];
                
                if (!cImage.loaded)
                {
                    cImage.onLoadCallback = (function(fPreviousOnLoad, cImage){
                        return function(){
                            fOnLoad(null, cImage);
                            fPreviousOnLoad(null, cImage);
                        };
                    })(cImage.onLoadCallback, cImage);
                }
                else
                {
                    fOnLoad(null, cImage);
                }
            }
            else
            {
                cImage = new Image();
                cImage.onLoadCallback = fOnLoad;
                
                cImage.onload = (function(cImage){
                    return function(){
                        cImage.loaded = true;
                        cImage.onLoadCallback(null, cImage);
                    };
                })(cImage);

                cImage.onerror = (function(cImage){
                    return function(){
                        cImage.onLoadCallback(new Error("Failed to load image: " + sUrl));
                    };
                })(cImage);

                cImage.src = sUrl;
                
                m_cImages[sUrl] = cImage;
            }
        }
    };
})();

//# sourceURL=engine/assets/assetmanager.js