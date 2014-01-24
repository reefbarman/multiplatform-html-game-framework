var nLogLevel = 3;

console.LOG_LEVELS = {
    INFO: 3,
    WARN: 2,
    ERROR: 1,
    DISABLED: 0
};

console.log = (function(fOrigLog){
    return function(){
        if (nLogLevel >= console.LOG_LEVELS.INFO)
        {
            fOrigLog.apply(console, arguments);

            if (isset(window.playgroundConsole))
            {
                window.playgroundConsole({
                    level: "Log",
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

            if (isset(window.playgroundConsole))
            {
                window.playgroundConsole({
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

            if (isset(window.playgroundConsole))
            {
                window.playgroundConsole({
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

            if (isset(window.playgroundConsole))
            {
                window.playgroundConsole({
                    level: "Error",
                    args: arguments
                });
            }
        }
    }; 
})(console.error);

//# sourceURL=engine/base/logging.js