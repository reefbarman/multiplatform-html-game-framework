var express = require("express");
var extend = require("xtend");
var fs = require("fs");
var path = require("path");
var zip = require("express-zip");
var sassMiddleware = require("node-sass-middleware");

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
cApp.use(express.json());
cApp.use(express.urlencoded({
    extended: true
}));
cApp.use(express.multipart());
cApp.use(sassMiddleware({
    src: process.cwd() + "/resources/sass",
    dest: process.cwd() + "/resources/css",
    debug: false,
    outputStyle: "expanded",
    prefix: "/Game/resources/css"
}));

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

cApp.use("/Game", function(cReq, cRes, fNext){
    var nJSIndex = cReq.path.indexOf(".js");

    if (nJSIndex != -1 && nJSIndex === (cReq.path.length - 3))
    {
        fs.readFile(process.cwd() + cReq.path, function(cErr, cData){
            if (!cErr)
            {
                var sSource = cData.toString();

                sSource += "\n//# sourceURL=" + cReq.path;

                cRes.send(sSource);
            }
            else
            {
                cRes.status(404);
                cRes.send(cErr.message);
            }
        });
    }
    else
    {
        fNext();
    }
});

cApp.use("/Game", express.static(process.cwd(), { index: "index.html", etag: false }));
cApp.use("/Tools", express.static(process.cwd() + "/tools", { index: "index.html" }));

cApp.use("/PlatformTools/ModifyFile", function(cReq, cRes, fNext){

    var sFile = cReq.param("file");
    var sContent = cReq.param("content");

    if (sFile && sContent)
    {
        var sFilePath = process.cwd() + sFile;

        fs.writeFile(sFilePath, sContent, function(cErr){
            if (!cErr)
            {
                cRes.send({ success: true });
            }
            else
            {
                cRes.send({ error: cErr });
            }
        });
    }
    else
    {
        fNext();
    }
});

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