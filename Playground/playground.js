var Express = require("express");
var extend = require("xtend");

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