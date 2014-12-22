include("base/device.js", true);
include("rendering/viewport.js", true);
include("rendering/renderer.js", true);
include("control/controller.js", true);
include("states/statemanager.js", true);
include("states/state.js", true);

var SM = EN.StateManager;

var s_bGamePaused = false;

function Game()
{
    this.__EnvironmentDetection();
    this.__Init();
}

Game.prototype.__EnvironmentDetection = function(){
    EN.Device.Init();
};

Game.prototype.__Init = function(){
    Game.Viewport = new EN.Viewport();
    
    var eCanvas = document.createElement(navigator.isCocoonJS ? "screencanvas" : "canvas");
    eCanvas.screencanvas = true;

    eCanvas.width = EN.Device.Width;
    eCanvas.height = EN.Device.Height;

    document.body.appendChild(eCanvas);

    this.m_cRenderer = new EN.Renderer(eCanvas.getContext("2d"), eCanvas.width, eCanvas.height);
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
    EN.Controller.Update(nDt);
    SM.Update(nDt);
};

Game.prototype.Draw = function(){
    this.m_cRenderer.Clear();
    
    SM.Draw(this.m_cRenderer);
};
    
Game.prototype.Run = function(){
    var self = this;
    
    var nLastUpdate = performance.now();
    var nLastDt = 0;

    var fUpdate = function(){
        try
        {
            if (s_bGamePaused)
            {
                nLastUpdate = performance.now();
                s_bGamePaused = false;
            }
            
            var nCurrentTime = performance.now();
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
