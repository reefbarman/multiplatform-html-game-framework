(function(){
    
    var cIncludedFiles = {};
    
    window.include = function(sFile, bEngineInclude){
        try
        {
            if (!cIncludedFiles[sFile])
            {
                var cRequest = new XMLHttpRequest();

                var sIncludePath = bEngineInclude ? window.EN.settings.enginePath : window.EN.settings.gamePath;

                cRequest.open("GET", sIncludePath + sFile, false);
                cRequest.send(null);

                if (cRequest.status === 200)
                {
                    (function(){
                        var exports = {};
                        
                        eval(cRequest.responseText);
                        
                        for (var sExport in exports)
                        {
                            window[sExport] = exports[sExport];
                        }
                    })();
                    
                    cIncludedFiles[sFile] = true;
                }
                else
                {
                    throw new Error("Unable to include file: " + sFile);
                }
            }
        }
        catch (e)
        {
            console.error(e.stack);
            throw e;
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

include("lib/hammer/hammer-1.0.6dev.min.js", true);

include("base/base.js", true);
include("base/logging.js", true);
include("base/game.js", true);

window.EN.Init = function(fOnInit){
    var fInit = function(){
        try
        {
            fOnInit();
        }
        catch (e)
        {
            console.error(e.stack);
            throw e;
        }
        
        fInit = null;
    };
    
    var cParams = parseQueryParams();
    
    if (isset(cParams.Playground))
    {
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
                        
                        if (fInit)
                        {
                            fInit();
                        }

                        break;
                }
            };
        })(), false);
    }
    else
    {
        fInit();
    }
};