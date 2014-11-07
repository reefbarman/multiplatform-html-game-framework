if (typeof EN == "undefined")
{
    EN = { settings: {} };
}

//Check include paths have been set
if (typeof EN.settings.enginePath == "undefined" || typeof EN.settings.gamePath == "undefined" || typeof EN.settings.resourcePath == "undefined")
{
    throw new Error("Please ensure you have defined all the required includes paths in your main.html before including engine.js");
}

(function(){
    
    var cIncludedFiles = {};
    
    window.include = function(sFile, bEngineInclude, bGlobalLib){
        try
        {
            if (!cIncludedFiles[sFile])
            {
                var cRequest = new XMLHttpRequest();

                var sIncludePath = bEngineInclude ? EN.settings.enginePath : EN.settings.gamePath;

                cRequest.open("GET", sIncludePath + sFile, false);
                cRequest.send(null);

                if (cRequest.status === 200)
                {
                    //If its a global lib allow it to pollute namespace
                    if (bGlobalLib)
                    {
                        eval(cRequest.responseText);
                    }
                    else
                    {
                        (function () {
                            var exports = {};

                            eval(cRequest.responseText);

                            for (var sExport in exports)
                            {
                                window[sExport] = exports[sExport];
                            }
                        })();
                    }
                    
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

include("base/base.js", true);
include("base/logging.js", true);
include("base/game.js", true);

include("lib/cocoonjs/CocoonJS.js", true);
include("lib/cocoonjs/CocoonJS_App.js", true);
include("lib/cocoonjs/CocoonJS_App_ForCocoonJS.js", true);

EN.Init = function(fOnInit){
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
        EN.playgroundEnv = true;
        
        window.addEventListener("message", (function(){
            var cParentWindow = null;

            var aValidInstruments = ["FPS", "Console", "Particles", "BoundingBoxes"];

            return function(cEvent){
                switch (cEvent.data.message)
                {
                    case "InitPGConnection":
                        cParentWindow = cEvent.source;
                        cParentWindow.postMessage({ message: "PGConnectionSuccessful" }, "*");
                        break;
                    case "ResetParticleEmitter":
                        if (isset(window["playgroundResetParticleEmitter"]))
                        {
                            playgroundResetParticleEmitter(cEvent.data.data);
                        }
                        break;
                    case "RestartParticleEmitter":
                        if (isset(window["playgroundRestartParticleEmitter"]))
                        {
                            playgroundRestartParticleEmitter(cEvent.data.data);
                        }
                        break;
                    case "RequestParticleEmitterUpdate":
                        if (isset(window["playgroundGetParticleEmitters"]))
                        {
                            playgroundGetParticleEmitters(cEvent.data.data);
                        }
                        break;
                    case "ModifyParticleEmitter":
                        if (isset(window["playgroundModifyParticleEmitter"]))
                        {
                            playgroundModifyParticleEmitter(cEvent.data.data);
                        }
                        break;
                    case "InstrumentUpdate":
                        aValidInstruments.forEach(function(sInstrument){
                            switch (sInstrument)
                            {
                                case "BoundingBoxes":
                                    if (isset(window["playgroundToggleBoundingBoxes"]))
                                    {
                                        window["playgroundToggleBoundingBoxes"](cEvent.data.data[sInstrument]);
                                    }
                                    break;
                                default:
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
                                    break;
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

//# sourceURL=engine/engine.js