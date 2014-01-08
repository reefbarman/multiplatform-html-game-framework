(function(){
    
    var nLogLevel = 0;
    
    console.LOG_LEVELS = {
        INFO: 0,
        WARN: 1,
        ERROR: 2,
        DISABLED: 3
    };
    
    console.log = (function(fOrigLog){
        return function(){
            if (nLogLevel >= console.LOG_LEVELS.INFO)
            {
                fOrigLog.apply(console, arguments);
                
                if (isset(window.playgroundDebugLog))
                {
                    window.playgroundDebugLog({
                        level: "Info",
                        args: arguments
                    });
                }
            }
        }; 
    })(console.log);
    
    console.info = (function(fOrigLog){
        return function(){
            if (nLogLevel >= console.LOG_LEVELS.INFO)
            {
                fOrigLog.apply(console, arguments);
                
                if (isset(window.playgroundDebugLog))
                {
                    window.playgroundDebugLog({
                        level: "Info",
                        args: arguments
                    });
                }
            }
        }; 
    })(console.info);
    
    console.warn = (function(fOrigLog){
        return function(){
            if (nLogLevel >= console.LOG_LEVELS.WARN)
            {
                fOrigLog.apply(console, arguments);
                
                if (isset(window.playgroundDebugLog))
                {
                    window.playgroundDebugLog({
                        level: "Warn",
                        args: arguments
                    });
                }
            }
        }; 
    })(console.warn);
    
    console.error = (function(fOrigLog){
        return function(){
            if (nLogLevel >= console.LOG_LEVELS.ERROR)
            {
                fOrigLog.apply(console, arguments);
                
                if (isset(window.playgroundDebugLog))
                {
                    window.playgroundDebugLog({
                        level: "Error",
                        args: arguments
                    });
                }
            }
        }; 
    })(console.error);
    
})();

//# sourceURL=base/logging.js