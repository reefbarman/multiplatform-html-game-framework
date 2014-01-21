var Express = require("express");
var extend = require("xtend");
var fs = require("fs");
var path = require("path");
var zip = require("express-zip");

var cConfig = require(process.cwd() + "/config.json");

var cPlaygroundConfig = extend({
    title: "",
    playground: {
        port: 1777
    }
}, cConfig);

var cApp = Express();

cApp.engine(".ejsh", require("ejs").__express);
cApp.set('views', __dirname + '/views');

cApp.use(Express.static(__dirname + '/static'));

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
                if (sPath[0] !== "." && sPath !== "Playground")
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

cApp.use("/Game", Express.static(process.cwd(), { index: "main.html" }));

cApp.use("/", function(cReq, cRes){
    cRes.render("index.ejsh", {
        title: cPlaygroundConfig.title + " Playground"
    });
});

cApp.use(Express.favicon());

var sPort = cPlaygroundConfig.playground.port;
var sBindAddr = "0.0.0.0";

cApp.listen(sPort, sBindAddr, function(){
    console.log("Listening on port " + sPort);
});