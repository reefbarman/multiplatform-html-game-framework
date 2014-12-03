var express = require("express");
var extend = require("xtend");
var fs = require("fs");
var path = require("path");
var zip = require("express-zip");

var cConfig = {};

try
{
    cConfig = require(path.join(process.cwd(), "config.json"));
}
catch(e){}

var cPlaygroundConfig = extend({
    title: "",
    playground: {
        port: 1777
    }
}, cConfig);

var cApp = express();

cApp.engine(".ejsh", require("ejs").__express);
cApp.set('views', __dirname + '/views');

cApp.use(express.static(__dirname + '/static'));
cApp.use(express.favicon());

cApp.use("/Game/game.zip", function(cReq, cRes, fNext){
    
    var sBaseDir = process.cwd();
    
    var fReadDir = function(sDir, fOnComplete){
        var aFiles = [];
        
        fs.readdir(sDir, function(cErr, aPaths){
            var nPaths = aPaths.length;
            
            var fPathComplete = function(){
                if (!(--nPaths))
                {
                    fOnComplete(aFiles);
                }
            };

            aPaths.forEach(function(sPath){
                if (sPath[0] !== "." && sPath !== "Playground" && sPath !== "releases")
                {
                    var sFullPath = path.join(sDir, sPath);

                    fs.stat(sFullPath, function(cErr, cStat){
                        if (!cErr)
                        {
                            if (cStat.isDirectory())
                            {
                                setImmediate(function(){
                                    fReadDir(sFullPath, function(aDirFiles){
                                        aFiles = aFiles.concat(aDirFiles);
                                        fPathComplete();
                                    });
                                });
                            }
                            else
                            {
                                aFiles.push({
                                    path: sFullPath,
                                    name: path.relative(sBaseDir, sFullPath)
                                });
                                
                                fPathComplete();
                            }
                        }
                        else
                        {
                            fPathComplete();
                        }
                    });
                }
                else
                {
                    fPathComplete();
                }
            });
        });
    };
    
    fReadDir(sBaseDir, function(aFiles){
        cRes.zip(aFiles);
        cRes.setHeader('Content-disposition', 'attachment; filename=game.zip');
    });
});

cApp.use("/Game", express.static(process.cwd(), { index: "index.html" }));
cApp.use("/Tools", express.static(process.cwd() + "/tools", { index: "index.html" }));

cApp.use("/", function(cReq, cRes, fNext){
    if (cReq.path === "/")
    {
        cRes.render("index.ejsh", {
            title: cPlaygroundConfig.title + " Playground"
        });
    }
    else
    {
        fNext();
    }
});

var sPort = cPlaygroundConfig.playground.port;

cApp.listen(sPort, "0.0.0.0", function(){
    console.log("Listening on port " + sPort);
});