include("base/device.js", true);
include("rendering/viewport.js", true);
include("rendering/renderer.js", true);
include("control/controller.js", true);
include("states/statemanager.js", true);
include("states/state.js", true);
include("timing/timer.js", true);

var SM = EN.StateManager;
var Timer = EN.Timer;

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

Game.prototype.Update = function(){
    EN.Controller.Update();
    SM.Update();
};

Game.prototype.Draw = function(){
    this.m_cRenderer.Clear();
    
    SM.Draw(this.m_cRenderer);
};
    
Game.prototype.Run = function(){
    var self = this;

    Timer.Init();
    
    var fUpdate = function(){
        try
        {
            Timer.Update();

            //Send smoothed dt to playground for fps
            if (window.playgroundFPS)
            {
                window.playgroundFPS(Timer.DeltaTimeSmoothed);
            }

            self.Update();
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
    Timer.Active = false;
    CocoonJS.App.pause();
};

Game.Resume = function(){
    CocoonJS.App.resume();
    Timer.Active = true;
};

EN.Game = Game;
