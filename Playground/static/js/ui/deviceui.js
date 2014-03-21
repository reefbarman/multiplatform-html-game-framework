function DeviceUI(fOnDeviceReady)
{
    var m_$DeviceFrame = null;
    var m_$DeviceSandbox = null;
    
    this.ChangeDevice = function(cOptions){
        if (m_$DeviceFrame && m_$DeviceSandbox)
        {
            m_$DeviceFrame.remove();
            m_$DeviceSandbox.remove();
        }
        
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

        var sDeviceUrl = "/Game?Playground=true&OS=" + cOptions.os + "&Device=" + cOptions.device;
        
        $("body").append(m_$DeviceFrame);
        
        m_$DeviceSandbox.load(function(){
            fOnDeviceReady($(this).get(0).contentWindow);
        }).attr("src", sDeviceUrl);
    };
}

DeviceUI.DEVICES = {
    IPHONE_5: {
        os: "iOS",
        device: "iPhone5",
        width: 1136,
        height: 640,
        pixelRatio: 2
    },
    IPHONE_4: {
        os: "iOS",
        device: "iPhone4",
        width: 960,
        height: 640,
        pixelRatio: 2
    }
};