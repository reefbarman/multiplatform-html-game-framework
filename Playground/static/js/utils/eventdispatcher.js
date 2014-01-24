var EventDispatcher = (function(){
    var m_cEvents = {};
    
    return {
        Bind: function(sEvent, fCallback){
            m_cEvents[sEvent] = fCallback;
        },
        Trigger: function(sEvent, cArgs){
            if (m_cEvents[sEvent])
            {
                m_cEvents[sEvent](cArgs);
            }
        }
    };
})();