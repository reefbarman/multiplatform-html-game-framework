var Express = require("express");

var cApp = Express();

cApp.use(Express.static(__dirname + '/static'));
cApp.use("/Game", Express.static(__dirname + '/../game', { index: "main.html" }));
cApp.use(Express.favicon());

var sPort = 1777;
var sBindAddr = "0.0.0.0";

cApp.listen(sPort, sBindAddr, function(){
    console.log("Listening on port " + sPort);
});