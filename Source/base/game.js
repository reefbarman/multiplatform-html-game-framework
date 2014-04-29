include("rendering/viewport.js", true);
include("rendering/renderer.js", true);
include("control/controller.js", true);
include("states/statemanager.js", true);
include("states/state.js", true);

var SM = EN.StateManager;
var now = Date.now;

var s_bGamePaused = false;

function Game()
{
    this.__EnvironmentDetection();
    this.__Init();
}

Game.prototype.__EnvironmentDetection = function(){
    /**
    * @namespace Device
    * @property {string} os - the OS the current device is running eg. ios
    * @property {string} model - the model of device running eg. IPHONE_5
    * @property {number} width - the width of the viewport in pixels
    * @property {number} height - the height of the viewport in pixels
    * @see EN
    */
   var cDevice = {};

   var cParams = parseQueryParams();

   if (isset(cParams.Playground))
   {
       cDevice.os = cParams.OS || "unknown";
       cDevice.model = cParams.Model || "generic";
   }
   else if (isset(window.CocoonJS) && isset(CocoonJS.App))
   {
       cDevice = CocoonJS.App.getDeviceInfo();
   }

   cDevice.width = window.innerWidth;
   cDevice.height = window.innerHeight;
   
   //console.log(JSON.stringify(cDevice));

   window.EN.device = cDevice;
};

Game.prototype.__Init = function(){
    Game.Viewport = new EN.Viewport();
    
    var eCanvas = document.createElement(navigator.isCocoonJS ? "screencanvas" : "canvas");
    eCanvas.screencanvas = true;

    eCanvas.width = EN.device.width;
    eCanvas.height = EN.device.height;

    document.body.appendChild(eCanvas);
    
    this.m_cRenderer = new EN.Renderer(eCanvas);
    EN.Controller.Init(eCanvas);
    
    CocoonJS.App.onActivated.addEventListener(function(){
        var cEvent = document.createEvent("Event");
        cEvent.initEvent("AppResumed", true, true);
        document.dispatchEvent(cEvent);
    });
    
    CocoonJS.App.onSuspended.addEventListener(function(){
        var cEvent = document.createEvent("Event");
        cEvent.initEvent("AppPaused", true, true);
        document.dispatchEvent(cEvent);
    });
};

Game.prototype.Update = function(nDt){
    SM.Update(nDt);
};

Game.prototype.Draw = function(){
    this.m_cRenderer.Clear();
    
    SM.Draw(this.m_cRenderer);
};
    
Game.prototype.Run = function(){
    var self = this;
    
    var nLastUpdate = now();
    var nLastDt = 0;

    var fUpdate = function(){
        try
        {
            if (s_bGamePaused)
            {
                nLastUpdate = now();
                s_bGamePaused = false;
            }
            
            var nCurrentTime = now();
            var nFrameTime = nCurrentTime - nLastUpdate;

            //Send smoothed dt to playground for fps
            if (window.playgroundFPS)
            {
                var nUpdateDt = nFrameTime * 0.02 + nLastDt * 0.98;
                window.playgroundFPS(nUpdateDt);
                nLastDt = nUpdateDt;
            }

            nLastUpdate = nCurrentTime;
            
            self.Update(nFrameTime);
            self.Draw();
            requestAnimationFrame(fUpdate);
        }
        catch (e)
        {
            console.error(e.stack);
            throw (e);
        }
    };

    fUpdate();
};

Game.Pause = function(){
    s_bGamePaused = true;
    CocoonJS.App.pause();
};

Game.Resume = function(){
    CocoonJS.App.resume();
};

EN.Game = Game;
//# sourceURL=engine/base/game.js