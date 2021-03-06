function ControlBar()
{
    var m_$ControlBar = null;
    
    var m_cDeviceUI = null;
    var m_cDeviceWindow = null;
    var m_sSelectedDevice = "IPHONE_5";
    
    var m_cInstruments = {
        FPS: {
            enabled: false,
            instance: null
        },
        Console:  {
            enabled: false,
            instance: null
        },
        Particles:  {
            enabled: false,
            instance: null
        },
        BoundingBoxes: {
            enabled: false,
            instance: null
        }
    };
    
    function Init()
    {
        m_$ControlBar = $("<div>").addClass("cPG_MainControlBar cPG_ControlBar");
        
        var sLastSelectedDevice = $.cookie("SelectedDevice");
        m_sSelectedDevice = sLastSelectedDevice ? sLastSelectedDevice : m_sSelectedDevice;
        
        m_cDeviceUI = new DeviceUI(InitCommunication);
        
        $(window).bind("message", function(cEvent){
            HandleCommunication(cEvent.originalEvent.data);
        }).resize(function(){
            EventDispatcher.Trigger("WindowResize", m_$ControlBar.outerHeight());
        });
        
        EventDispatcher.Bind("SendMessage", function(cArgs){
            if (m_cDeviceWindow)
            {
                m_cDeviceWindow.postMessage(cArgs, "*");
            }
        });
        
        InitControls();
    }
    
    function InitControls()
    {
        for (var sKey in m_cInstruments)
        {
            var bEnabled = $.cookie(sKey) === "true";
            
            m_cInstruments[sKey].enabled = bEnabled;
            
            switch (sKey)
            {
                case "FPS":
                    m_cInstruments[sKey].instance = new FPSMeter();
                    break;
                case "Console":
                    m_cInstruments[sKey].instance = new Console();
                    break;
                case "Particles":
                    m_cInstruments[sKey].instance = new ParticleControl();
                    break;
            }
            
            if (bEnabled && m_cInstruments[sKey].instance)
            {
                m_cInstruments[sKey].instance.Show();
            }
            
            m_$ControlBar.append(
                $("<div>").append(
                    $("<label>").text(sKey + ": "),
                    $("<input>").attr({"type": "checkbox", "checked": m_cInstruments[sKey].enabled}).change((function(sKey){
                        return function(){
                            var bEnabled = $(this).is(":checked");
                            
                            m_cInstruments[sKey].enabled = bEnabled;
                            $.cookie(sKey, bEnabled);
                            
                            InstrumentUpdate();
                            
                            if (m_cInstruments[sKey].instance)
                            {
                                if (bEnabled)
                                {
                                    m_cInstruments[sKey].instance.Show();
                                }
                                else
                                {
                                    m_cInstruments[sKey].instance.Hide();
                                }
                            }
                        };
                    })(sKey))
                )
            );
        }
        
        var $DeviceSelect = $("<select>").change(function(){
            var sValue = $(this).val();

            m_cDeviceUI.ChangeDevice(sValue);
            $.cookie("SelectedDevice", sValue);
        });
        
        for (var sDevice in DeviceUI.DEVICES)
        {
            $DeviceSelect.append($("<option>").text(DeviceUI.DEVICES[sDevice].name).val(sDevice));
        }
        
        m_$ControlBar.append(
            $("<div>").addClass("cPG_DeviceTypeControl").append(
                $("<label>").text("Device: "),
                $DeviceSelect.val(m_sSelectedDevice)
            )
        );
    }
    
    function InitCommunication(cDeviceWindow)
    {
        m_cDeviceWindow = cDeviceWindow;
        m_cDeviceWindow.postMessage({ message: "InitPGConnection" }, "*");
    }
    
    function HandleCommunication(cCommunication)
    {
        switch(cCommunication.message)
        {
            case "PGConnectionSuccessful":
                InstrumentUpdate();
                break;
            default:
                EventDispatcher.Trigger(cCommunication.message, cCommunication.data);
                break;
        }
    }
    
    function InstrumentUpdate()
    {
        var cInstrumentsEnabled = {};
        
        for (var sKey in m_cInstruments)
        {
            cInstrumentsEnabled[sKey] = m_cInstruments[sKey].enabled;
        }
        
        m_cDeviceWindow.postMessage({ message: "InstrumentUpdate", data: cInstrumentsEnabled }, "*");
    }
    
    this.Show = function(){
        $("body").append(m_$ControlBar);
        
        m_cDeviceUI.ChangeDevice(m_sSelectedDevice);
        
        EventDispatcher.Trigger("WindowResize", m_$ControlBar.outerHeight());
    };
    
    Init();
}