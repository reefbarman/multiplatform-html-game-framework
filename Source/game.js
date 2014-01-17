include("rendering/renderer.js", true);
include("rendering/drawmanager.js", true);
include("entities/entitymanager.js", true);
include("control/controller.js", true);
include("states/statemanager.js", true);

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
    
    this.m_cRenderer = new Renderer(eCanvas);
    DrawManager.Init(this.m_cRenderer);
    Camera.Init();
    
    Controller.Init(eCanvas);
}

Game.prototype.Update = function(nDt){
    StateManager.Update(nDt);
    EntityManager.Update(nDt);
};

Game.prototype.Draw = function(){
    this.m_cRenderer.Clear();
    
    DrawManager.Draw();
    StateManager.Draw(this.m_cRenderer);
};
    
Game.prototype.Run = function(){
    var self = this;
    
    var nLastUpdate = null;
    var nLastDt = 0;
    //var nAccumulated = 0;
    //var nDt = 1000 / 60;
    var fTime = Date.now;

    var fUpdate = function(){
        try
        {
            var nCurrentTime = fTime();
            var nFrameTime = nCurrentTime - nLastUpdate;

            //Send smoothed dt to playground for fps
            if (window.playgroundFPSUpdate)
            {
                var nUpdateDt = nFrameTime * 0.02 + nLastDt * 0.98;
                window.playgroundFPSUpdate(nUpdateDt);
                nLastDt = nUpdateDt;
            }

            nLastUpdate = nCurrentTime;
            
            //nAccumulated += nFrameTime;
            
            /*while (nAccumulated >= nDt)
            {
                self.Update(nDt);
                nAccumulated -= nDt;
            }*/
            
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

    nLastUpdate = fTime();
    fUpdate();
};

//# sourceURL=game.js