include("rendering/renderer.js", true);
include("control/controller.js", true);
include("states/statemanager.js", true);
include("states/state.js", true);

var SM = EN.StateManager;

var now = Date.now;

function Game()
{
    function EnvironmentDetection()
    {
        /**
         * @namespace Device
         * @property {string} os - the OS the current device is running eg. iOS
         * @property {string} type - the type of device running eg. iPhone5
         * @property {number} width - the width of the viewport in pixels
         * @property {number} height - the height of the viewport in pixels
         * @see EN
         */
        var cDevice = {};

        var cParams = parseQueryParams();

        if (isset(cParams.Playground))
        {
            cDevice.os = cParams.OS || "Unknown";
            cDevice.type = cParams.Device || "Generic";
        }
        else
        {
            //TODO TC: Do device detection
        }
        
        cDevice.width = window.innerWidth;
        cDevice.height = window.innerHeight;
        
        window.EN.device = cDevice;
    }
    
    EnvironmentDetection();
    
    var eCanvas = document.createElement("canvas");

    eCanvas.width = window.EN.device.width;
    eCanvas.height = window.EN.device.height;

    document.body.appendChild(eCanvas);
    
    this.m_cRenderer = new EN.Renderer(eCanvas);
    EN.Controller.Init(eCanvas);
    
    EN.Camera.Init();
}

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

EN.Game = Game;
//# sourceURL=engine/base/game.js