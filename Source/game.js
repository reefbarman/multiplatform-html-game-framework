/**
 * @class
 * @constructor
 */
function Game()
{
    var m_cApplication = null;
    
    function Init()
    {
        
    }
    
    /**
     * Allows setting the application the game will run
     * 
     * @param {Application} cApp - an application to update on each game loop
     */
    this.SetApplication = function(cApp){
        if (cApp && isset(cApp.Update))
        {
            m_cApplication = cApp;
        }
    };
   
    /**
     * Start the game update loop
     * Requires an application to be set beforehand
     */
    this.Run = function(){
        var nLastUpdate = null;
        var nLastDt = 0;
        var fTime = Date.now;
        
        var fUpdate = function(){
            var nCurrentTime = fTime();
            var nDt = nCurrentTime - nLastUpdate;
            
            //Send smoothed dt to playground for fps
            if (window.playgroundFPSUpdate)
            {
                var nUpdateDt = nDt * 0.02 + nLastDt * 0.98;
                window.playgroundFPSUpdate(nUpdateDt);
                nLastDt = nUpdateDt;
            }
            
            nLastUpdate = nCurrentTime;
            
            m_cApplication.Update(nDt);
            requestAnimationFrame(fUpdate);
        };
        
        if (m_cApplication)
        {
            nLastUpdate = (new Date()).getTime();
            fUpdate();
        }
        else
        {
            console.error("No Application Set!");
        }
    };
    
    Init();
}

//# sourceURL=game.js