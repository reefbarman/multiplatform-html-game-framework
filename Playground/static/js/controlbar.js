function ControlBar()
{
    var m_$ControlBar = null;
    var m_$FPSUpdate = null;
    var m_$ConsoleLog = null;
    
    var m_cDeviceWindow = null;
    
    var m_cInstrumentsEnabled = {
        FPSUpdate: true,
        DebugLog:  true
    };
    
    function Init()
    {
        m_$ControlBar = $("#iCQ_ControlBar");
        m_$FPSUpdate = $("#iCQ_FPSUpdate");
        m_$ConsoleLog = $("#iCQ_ConsoleLog");
        
        $(window).bind("message", function(cEvent){
            switch(cEvent.originalEvent.data.message)
            {
                case "HandShakeSuccessful":
                    InstrumentUpdate();
                    break;
                case "FPSUpdate":
                    FPSUpdate(cEvent.originalEvent.data.data);
                    break;
                case "DebugLog":
                    DebugLog(cEvent.originalEvent.data.data);
                    break;
            }
        });
        
        for (var sKey in m_cInstrumentsEnabled)
        {
            m_cInstrumentsEnabled[sKey] = $.cookie(sKey) === "true";
        }
        
        DebugLogState();
        
        var $FPSControl = $("<input>").attr({"type": "checkbox", "checked": m_cInstrumentsEnabled.FPSUpdate}).change(function(){
            m_cInstrumentsEnabled.FPSUpdate = $(this).is(":checked");
            InstrumentUpdate();
            $.cookie("FPSUpdate", m_cInstrumentsEnabled.FPSUpdate);
        });
        
        var $LogControl = $("<input>").attr({"type": "checkbox", "checked": m_cInstrumentsEnabled.DebugLog}).change(function(){
            m_cInstrumentsEnabled.DebugLog = $(this).is(":checked");
            
            DebugLogState();
            
            InstrumentUpdate();
            $.cookie("DebugLog", m_cInstrumentsEnabled.DebugLog);
        });
        
        m_$ControlBar.append(
            $("<div>").append(
                $("<label>").text("FPS Counter: "),
                $FPSControl
            ),
            $("<div>").append(
                $("<label>").text("Console Log: "),
                $LogControl
            )
        );
    }
    
    function InstrumentUpdate()
    {
        m_cDeviceWindow.postMessage({ message: "InstrumentUpdate", data: m_cInstrumentsEnabled }, "*");
    }
    
    function FPSUpdate(nFrameDelta)
    {
        m_$FPSUpdate.text(Math.round(1000 / nFrameDelta) + " FPS");
    }
    
    function DebugLogState()
    {
        if (m_cInstrumentsEnabled.DebugLog)
        {
            m_$ConsoleLog.show();
        }
        else
        {
            m_$ConsoleLog.hide();
        }
    }
    
    function DebugLog(cLogging)
    {
        for (var i in cLogging.args)
        {
            var val = cLogging.args[i];
            var sTypeOf = typeof val;
            
            var $Element = $("<p>");
            var sValString = "LOG ERROR";
            
            switch (sTypeOf)
            {
                case "object":
                    sValString = JSON.stringify(val, null, 2);
                    $Element = $("<pre>");
                    break;
                default:
                    sValString = val;
                    break;
            }
            
            m_$ConsoleLog.find("aside").append(
                $Element.addClass("cCQ_LogLevel" + cLogging.level).text(sValString)
            );
        }
    }
    
    this.OnDeviceWindowAvailable = function(cDeviceWindow){
        m_cDeviceWindow = cDeviceWindow;
        m_cDeviceWindow.postMessage({ message: "HandShake" }, "*");
    };
    
    Init();
}