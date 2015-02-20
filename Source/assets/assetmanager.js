//ECMAScript6

class AssetManager
{
    constructor()
    {
        this.m_cImages = {};
        this.m_cFiles = {};
        this.m_cAudioFiles = {};
    }

    LoadImage(sUrl, fOnLoad)
    {
        var cImage = null;

        if (isset(this.m_cImages[sUrl]))
        {
            cImage = this.m_cImages[sUrl];

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

            this.m_cImages[sUrl] = cImage;
        }
    }

    ReleaseImage(sUrl)
    {
        if (isset(this.m_cImages[sUrl]))
        {
            this.m_cImages[sUrl].refCount--;

            if (this.m_cImages[sUrl].refCount <= 0)
            {
                delete this.m_cImages[sUrl];
            }
        }
    }

    LoadFile(sUrl, fOnLoad)
    {
        var cFile = null;

        if (isset(this.m_cFiles[sUrl]))
        {
            cFile = this.m_cFiles[sUrl];

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

            this.m_cFiles[sUrl] = cFile;
        }
    }

    ReleaseFile(sUrl)
    {
        if (isset(this.m_cFiles[sUrl]))
        {
            this.m_cFiles[sUrl].refCount--;

            if (this.m_cFiles[sUrl].refCount <= 0)
            {
                delete this.m_cFiles[sUrl];
            }
        }
    }

    LoadAudio(sUrl, fOnLoad)
    {
        var cAudio = null;

        if (isset(this.m_cAudioFiles[sUrl]))
        {
            cAudio = this.m_cAudioFiles[sUrl];

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

            this.m_cAudioFiles[sUrl] = cAudio;
        }
    }

    ReleaseAudio(sUrl)
    {
        if (isset(this.m_cAudioFiles[sUrl]))
        {
            this.m_cAudioFiles[sUrl].refCount--;

            if (this.m_cAudioFiles[sUrl].refCount <= 0)
            {
                delete this.m_cAudioFiles[sUrl];
            }
        }
    }
}

EN.AssetManager = new AssetManager();

