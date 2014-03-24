EN.AssetManager = (function(){
    var m_cImages = {};
    var m_cJSONFiles = {};
    var m_cAudioFiles = {};
    
    return {
        LoadImage: function(sUrl, fOnLoad){
            var cImage = null;
            
            if (isset(m_cImages[sUrl]))
            {
                cImage = m_cImages[sUrl];
                
                if (!cImage.loaded)
                {
                    cImage.onLoadCallback = (function(fPreviousOnLoad, fCurrentOnLoad, cImage){
                        return function(cErr, cBaseImage){
                            if (!cErr)
                            {
                                cImage.refCount++;
                            }
                            
                            fCurrentOnLoad(cErr, cBaseImage);
                            fPreviousOnLoad(cErr, cBaseImage);
                        };
                    })(cImage.onLoadCallback, fOnLoad, cImage);
                }
                else
                {
                    cImage.refCount++;
                    fOnLoad(null, cImage.image);
                }
            }
            else
            {
                cImage = {
                    image: new Image(),
                    onLoadCallback: fOnLoad,
                    loaded: false,
                    refCount: 0
                };
                
                cImage.image.onload = (function(cImage){
                    return function(){
                        cImage.loaded = true;
                        cImage.refCount++;
                        cImage.onLoadCallback(null, cImage.image);
                    };
                })(cImage);

                cImage.image.onerror = (function(cImage, sUrl){
                    return function(){
                        cImage.onLoadCallback(new Error("Failed to load image: " + sUrl));
                    };
                })(cImage, sUrl);

                cImage.image.src = EN.settings.resourcePath + "images/" + sUrl;
                
                m_cImages[sUrl] = cImage;
            }
        },
        ReleaseImage: function(sUrl){
            if (isset(m_cImages[sUrl]))
            {
                m_cImages[sUrl].refCount--;
                
                if (m_cImages[sUrl].refCount <= 0)
                {
                    delete m_cImages[sUrl];
                }
            }
        },
        LoadJSON: function(sUrl, fOnLoad){
            var cJSONFile = null;
            
            if (isset(m_cJSONFiles[sUrl]))
            {
                cJSONFile = m_cJSONFiles[sUrl];
                
                if (!cJSONFile.loaded)
                {
                    cJSONFile.onLoadCallback = (function(fPreviousOnLoad, fCurrentOnLoad, cJSONFile){
                        return function(cErr, cJSON){
                            if (!cErr)
                            {
                                cJSONFile.refCount++;
                            }
                            
                            fCurrentOnLoad(cErr, cJSON);
                            fPreviousOnLoad(cErr, cJSON);
                        };
                    })(cJSONFile.onLoadCallback, fOnLoad, cJSONFile);
                }
                else
                {
                    cJSONFile.refCount++;
                    fOnLoad(null, cJSONFile.json);
                }
            }
            else
            {
                cJSONFile = {
                    json: null,
                    onLoadCallback: fOnLoad,
                    loaded: false,
                    refCount: 0
                };
                
                ajaxLoad({
                    src: EN.settings.resourcePath + sUrl,
                    onComplete: (function(cJSONFile){
                        return function(cErr, cJSON){
                            if (!cErr)
                            {
                                cJSONFile.loaded = true;
                                cJSONFile.json = cJSON;
                                cJSONFile.refCount++;
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
        },
        ReleaseJSON: function(sUrl){
            if (isset(m_cJSONFiles[sUrl]))
            {
                m_cJSONFiles[sUrl].refCount--;
                
                if (m_cJSONFiles[sUrl].refCount <= 0)
                {
                    delete m_cJSONFiles[sUrl];
                }
            }
        },
        LoadAudio: function(sUrl, fOnLoad){
            var cAudio = null;
            
            if (isset(m_cAudioFiles[sUrl]))
            {
                cAudio = m_cAudioFiles[sUrl];
                
                if (!cAudio.loaded)
                {
                    cAudio.onLoadCallback = (function(fPreviousOnLoad, fCurrentOnLoad, cAudio){
                        return function(cErr, cBaseAudio){
                            if (!cErr)
                            {
                                cAudio.refCount++;
                            }
                            
                            fCurrentOnLoad(cErr, cBaseAudio);
                            fPreviousOnLoad(cErr, cBaseAudio);
                        };
                    })(cAudio.onLoadCallback, fOnLoad, cAudio);
                }
                else
                {
                    cAudio.refCount++;
                    fOnLoad(null, cAudio.audio);
                }
            }
            else
            {
                cAudio = {
                    audio: new Audio(EN.settings.resourcePath + "sounds/" + sUrl),
                    onLoadCallback: fOnLoad,
                    loaded: false,
                    error: false,
                    refCount: 0
                };
                
                cAudio.audio.addEventListener('canplaythrough', (function(cAudio){
                    return function(){
                        if (!cAudio.loaded)
                        {
                            cAudio.loaded = true;
                            cAudio.refCount++;
                            cAudio.onLoadCallback(null, cAudio.audio);
                        }
                    };
                })(cAudio), false);
                
                cAudio.audio.addEventListener('error', (function(cAudio, sUrl){
                    return function(){
                        if (!cAudio.error)
                        {
                            cAudio.error = true;
                            cAudio.onLoadCallback(new Error("Failed to load audio: " + sUrl));
                        }
                    };
                })(cAudio, sUrl));

                cAudio.audio.load();
                
                m_cAudioFiles[sUrl] = cAudio;
            }
        },
        ReleaseAudio: function(sUrl){
            if (isset(m_cAudioFiles[sUrl]))
            {
                m_cAudioFiles[sUrl].refCount--;
                
                if (m_cAudioFiles[sUrl].refCount <= 0)
                {
                    delete m_cAudioFiles[sUrl];
                }
            }
        }
    };
})();

//# sourceURL=engine/assets/assetmanager.js