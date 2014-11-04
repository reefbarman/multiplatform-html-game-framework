function DeviceUI(fOnDeviceReady)
{
    var m_$DeviceFrame = null;
    var m_$DeviceSandbox = null;
    var m_$DeviceScale = null;
    
    this.ChangeDevice = function(sIdentifier){
        var cOptions = DeviceUI.DEVICES[sIdentifier];
        
        if (cOptions)
        {
            if (m_$DeviceFrame && m_$DeviceSandbox && m_$DeviceScale)
            {
                m_$DeviceFrame.remove();
                m_$DeviceSandbox.remove();
                m_$DeviceScale.remove();
            }

            var nWidth = cOptions.width > 0 ? cOptions.width : "100%";
            var nHeight = cOptions.height > 0 ? cOptions.height : "100%";

            m_$DeviceSandbox = $("<iframe>").addClass("cPG_DeviceSandbox").css({
                width: nWidth,
                height: nHeight,
                transform: "scale(" + 1 / cOptions.pixelRatio + ")",
                "margin-left": nWidth !== "100%" ? -(cOptions.width / 2) : "auto",
                "margin-top": nHeight !== "100%" ? -(cOptions.height / 2) : "auto"
            });

            m_$DeviceFrame = $("<div>").addClass("cPG_DeviceFrame cPG_Device_" + cOptions.os + "_" + sIdentifier).append(
                m_$DeviceSandbox
            );

            if (nWidth === "100%" || nHeight === "100%")
            {
                m_$DeviceFrame.addClass("cPG_DeviceFrameFullScreen");
                m_$DeviceSandbox.addClass("cPG_DeviceFrameFullScreen");
            }

            m_$DeviceScale = $("<div>").addClass("cPG_DeviceScale").append(m_$DeviceFrame).css("transform", "scale(" + cOptions.displayScale + ")");

            var $Body = $("body");

            $(window).resize(function(){
                m_$DeviceScale.height($Body.height() - 34);
            });

            m_$DeviceScale.height($Body.height() - 34);

            var sDeviceUrl = "/Game?Playground=true&OS=" + cOptions.os + "&Model=" + sIdentifier;

            $Body.append(m_$DeviceScale);

            m_$DeviceSandbox.load(function(){
                fOnDeviceReady($(this).get(0).contentWindow);
            }).attr("src", sDeviceUrl);
        }
    };
}

DeviceUI.DEVICES = {
    IPHONE_5: {
        name: "iPhone 5",
        os: "ios",
        width: 1136,
        height: 640,
        pixelRatio: 2,
        displayScale: 1
    },
    IPHONE_4: {
        name: "iPhone 4",
        os: "ios",
        width: 960,
        height: 640,
        pixelRatio: 2,
        displayScale: 1
    },
    IPHONE_3GS: {
        name: "iPhone 3GS",
        os: "ios",
        width: 480,
        height: 320,
        pixelRatio: 1,
        displayScale: 1
    },
    IPAD: {
        name: "iPad",
        os: "ios",
        width: 2048,
        height: 1536,
        pixelRatio: 2,
        displayScale: 0.8
    },
    NEXUS_4: {
        name: "Nexus 4",
        os: "android",
        width: 1280,
        height: 768,
        pixelRatio: 2,
        displayScale: 1
    },
    NEXUS_7: {
        name: "Nexus 7",
        os: "android",
        width: 1280,
        height: 800,
        pixelRatio: 1,
        displayScale: 0.6
    },
    PC: {
        name: "PC",
        os: "windows",
        width: -1,
        height: -1,
        pixelRatio: 1,
        displayScale: 1
    }
};