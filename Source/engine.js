(function(){
    
    var cIncludedFiles = {};
    
    window.include = function(sFile, bUseIncludePath){
        if (!cIncludedFiles[sFile])
        {
            var cRequest = new XMLHttpRequest();
    
            var sPath = bUseIncludePath ? window.MHTGF.settings.includePath + sFile : sFile;

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

if (typeof window["MHTGF"] == "undefined")
{
    window.MHTGF = {
        settings: {
            includePath: "/"
        }
    };
}

include("base/base.js", true);
include("game.js", true);