//TODO reference counting and deleting images when all reference are given up

EN.AssetManager = (function(){
    var m_cImages = {};
    var m_cJSONFiles = {};
    
    return {
        LoadImage: function(sUrl, fOnLoad){
            var cImage = null;
            
            if (isset(m_cImages[sUrl]))
            {
                cImage = m_cImages[sUrl];
                
                if (!cImage.loaded)
                {
                    cImage.onLoadCallback = (function(fPreviousOnLoad, fCurrentOnLoad){
                        return function(cErr, cImage){
                            fCurrentOnLoad(cErr, cImage);
                            fPreviousOnLoad(cErr, cImage);
                        };
                    })(cImage.onLoadCallback, fOnLoad);
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

                cImage.src = EN.settings.resourcePath + "images/" + sUrl;
                
                m_cImages[sUrl] = cImage;
            }
        },
        LoadJSON: function(sUrl, fOnLoad){
            var cJSONFile = null;
            
            if (isset(m_cJSONFiles[sUrl]))
            {
                cJSONFile = m_cJSONFiles[sUrl];
                
                if (!cJSONFile.loaded)
                {
                    cJSONFile.onLoadCallback = (function(fPreviousOnLoad, fCurrentOnLoad){
                        return function(cErr, cJSON){
                            fCurrentOnLoad(cErr, cJSON);
                            fPreviousOnLoad(cErr, cJSON);
                        };
                    })(cJSONFile.onLoadCallback, fOnLoad);
                }
                else
                {
                    fOnLoad(null, cJSONFile.json);
                }
            }
            else
            {
                cJSONFile = {
                    json: null,
                    onLoadCallback: fOnLoad,
                    loaded: false
                };
                
                ajaxLoad({
                    src: EN.settings.resourcePath + sUrl,
                    onComplete: (function(cJSONFile){
                        return function(cErr, cJSON){
                            if (!cErr)
                            {
                                cJSONFile.loaded = true;
                                cJSONFile.json = cJSON;
                                cJSONFile.onLoadCallback(null, cJSON);
                            }
                            else
                            {
                                cJSONFile.onLoadCallback(cErr);
                            }
                        };
                    })(cJSONFile)
                });
                
                m_cJSONFiles[sUrl] = cJSONFile;
            }
        }
    };
})();

//# sourceURL=engine/assets/assetmanager.js