(function(){
    /**
     * 
     * @callback OnDeviceWindowAvailableCallback
     * 
     * @param {Window} cDeviceWindow - the window emulating the current running device
     */
    
    /**
     * Initializes the playground by setting up appropriate frames and sandbox url
     * 
     * @param {Object} cOptions
     * @param {string} cOptions.os - The emulated devices OS eg 'iOS' or 'Android'
     * @param {string} cOptions.device - The emulated device identifier (optional) eg iPhone5 or Nexus5
     * @param {number} cOptions.width - Native device width
     * @param {number} cOptions.height - Native device height
     * @param {number} cOptions.pixelRatio - Device pixel ratio ie a value of 2 represents a 2:1 ratio with a typical PC monitor pixel
     * 
     * @param {OnDeviceWindowAvailableCallback} fOnDeviceWindowAvailable
     */
    function SetDevice(cOptions, fOnDeviceWindowAvailable)
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
        
        var $DeviceFrame = $("#iCQ_DeviceFrame");
        var $DeviceSandbox = $("#iCQ_DeviceSandbox");
        
        $DeviceFrame.addClass("cCQ_Device_" + cOptions.os + "_" + cOptions.device);
        
        $DeviceSandbox.css({
            width: cOptions.width,
            height: cOptions.height,
            transform: "scale(" + 1 / cOptions.pixelRatio + ")",
            "margin-left": -(cOptions.width / cOptions.pixelRatio),
            "margin-top": -(cOptions.height / cOptions.pixelRatio)
        }).load(function(){
            fOnDeviceWindowAvailable($(this).get(0).contentWindow);
        }).attr("src", "/Game?Playground=true&OS=" + cOptions.os + "&Device=" + cOptions.device);
    }
    
    /**
     * Detect the device we want to sandbox
     * 
     * @returns {Object} detect device details from store cookies and request params
     */
    function GetDeviceDetails()
    {
        //TODO Detect currently selected device
        return {};
    }

    $(document).ready(function(){
        new UIHandler();
        var cControlBar = new ControlBar();
        
        //Setup Required Device
        SetDevice(GetDeviceDetails(), cControlBar.OnDeviceWindowAvailable);
    });
})();