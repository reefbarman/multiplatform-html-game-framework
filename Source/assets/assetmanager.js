EN.AssetManager = (function(){
    var m_cImages = {};
    var m_cFiles = {};
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
        LoadFile: function(sUrl, fOnLoad){
            var cFile = null;
            
            if (isset(m_cFiles[sUrl]))
            {
                cFile = m_cFiles[sUrl];
                
                if (!cFile.loaded)
                {
                    cFile.onLoadCallback = (function(fPreviousOnLoad, fCurrentOnLoad, cFile){
                        return function(cErr, sContent){
                            if (!cErr)
                            {
                                cFile.refCount++;
                            }
                            
                            fCurrentOnLoad(cErr, sContent);
                            fPreviousOnLoad(cErr, sContent);
                        };
                    })(cFile.onLoadCallback, fOnLoad, cFile);
                }
                else
                {
                    cFile.refCount++;
                    fOnLoad(null, cFile.content);
                }
            }
            else
            {
                cFile = {
                    content: null,
                    onLoadCallback: fOnLoad,
                    loaded: false,
                    refCount: 0
                };
                
                ajaxLoad({
                    src: EN.settings.resourcePath + sUrl,
                    dataType: "text",
                    onComplete: (function(cFile){
                        return function(cErr, sContent){
                            if (!cErr)
                            {
                                cFile.loaded = true;
                                cFile.content = sContent;
                                cFile.refCount++;
                                cFile.onLoadCallback(null, sContent);
                            }
                            else
                            {
                                cFile.onLoadCallback(cErr);
                            }
                        };
                    })(cFile)
                });
                
                m_cFiles[sUrl] = cFile;
            }
        },
        ReleaseFile: function(sUrl){
            if (isset(m_cFiles[sUrl]))
            {
                m_cFiles[sUrl].refCount--;
                
                if (m_cFiles[sUrl].refCount <= 0)
                {
                    delete m_cFiles[sUrl];
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