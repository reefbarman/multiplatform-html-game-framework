(function(){
    
    var cIncludedFiles = {};
    
    window.include = function(sFile, bUseIncludePath){
        if (!cIncludedFiles[sFile])
        {
            var cRequest = new XMLHttpRequest();
    
            var sPath = bUseIncludePath ? window.EN.settings.includePath + sFile : sFile;

            cRequest.open("GET", sPath, false);
            cRequest.send(null);

            if (cRequest.status === 200)
            {
                eval.call(window, cRequest.responseText);
                cIncludedFiles[sFile] = true;
            }
            else
            {
                throw new Error("Unable to include file: " + sFile);
            }
        }
    };
})();

if (typeof window["EN"] == "undefined")
{
    window.EN = {
        settings: {
            includePath: "/"
        }
    };
}

include("base/base.js", true);
include("lib/hammer/hammer-1.0.6dev.min.js", true);
include("game.js", true);

window.EN.Init = function(fOnInit){
    window.addEventListener("message", (function(){
        var cParentWindow = null;
        
        var aValidInstruments = ["FPSUpdate", "DebugLog"];
        
        return function(cEvent){
            switch (cEvent.data.message)
            {
                case "HandShake":
                    cParentWindow = cEvent.source;
                    cParentWindow.postMessage({ message: "HandShakeSuccessful" }, "*");
                    break;
                case "InstrumentUpdate":
                    aValidInstruments.forEach(function(sInstrument){
                        if (isset(cEvent.data.data[sInstrument]) && cEvent.data.data[sInstrument])
                        {
                            window["playground" + sInstrument] = (function(sInstrument){
                                return function(data){
                                    try
                                    {
                                        cParentWindow.postMessage({
                                            message: sInstrument,
                                            data: data
                                        }, "*");
                                    }
                                    catch (e){}
                                };
                            })(sInstrument);
                        }
                        else
                        {
                            delete window["playground" + sInstrument];
                        }
                    });
                    
                    break;
            }
        };
    })(), false);
    
    fOnInit();
};