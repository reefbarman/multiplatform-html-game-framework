function DeviceUI(cOptions, fOnDeviceReady)
{
    var m_$DeviceFrame = null;
    var m_$DeviceSandbox = null;
    
    var m_sDeviceUrl = null;
    
    function Init()
    {
        //DEFAULTS
        var cDefaults = {
            os: "iOS",
            device: "iPhone5",
            width: 1136,
            height: 640,
            pixelRatio: 2
        };
        
        cOptions = $.extend({}, cDefaults, cOptions);
        
        m_$DeviceSandbox = $("<iframe>").addClass("cPG_DeviceSandbox").css({
            width: cOptions.width,
            height: cOptions.height,
            transform: "scale(" + 1 / cOptions.pixelRatio + ")",
            "margin-left": -(cOptions.width / cOptions.pixelRatio),
            "margin-top": -(cOptions.height / cOptions.pixelRatio)
        });
        
        m_$DeviceFrame = $("<div>").addClass("cPG_DeviceFrame cPG_Device_" + cOptions.os + "_" + cOptions.device).append(
            m_$DeviceSandbox
        );

        m_sDeviceUrl = "/Game?Playground=true&OS=" + cOptions.os + "&Device=" + cOptions.device;
    }
    
    this.Show = function(){
        $("body").append(m_$DeviceFrame);
        
        m_$DeviceSandbox.load(function(){
            fOnDeviceReady($(this).get(0).contentWindow);
        }).attr("src", m_sDeviceUrl);
    };
    
    Init();
}