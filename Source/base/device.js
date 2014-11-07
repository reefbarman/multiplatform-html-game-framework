/**
 * @namespace Device
 * @property {string} os - the OS the current device is running eg. ios
 * @property {string} model - the model of device running eg. IPHONE_5
 * @property {number} width - the width of the viewport in pixels
 * @property {number} height - the height of the viewport in pixels
 * @see EN
 */
EN.Device = (function(){

    var m_nWidth = 0;
    var m_nHeight = 0;

    var m_sOS = "unknown";
    var m_sModel = "generic";

    var cDevice = {
        Init: function(){
            var cParams = parseQueryParams();

            if (isset(cParams.Playground))
            {
                m_sOS = cParams.OS || "unknown";
                m_sModel = cParams.Model || "generic";
            }
            else
            {
                //TODO get platform information from cocoonjs etc
            }

            m_nWidth = window.innerWidth;
            m_nHeight = window.innerHeight;
        }
    };

    Object.defineProperty(cDevice, "Width", {
        get: function(){
            return m_nWidth;
        }
    });

    Object.defineProperty(cDevice, "Height", {
        get: function(){
            return m_nHeight;
        }
    });

    Object.defineProperty(cDevice, "OS", {
        get: function(){
            return m_sOS;
        }
    });

    Object.defineProperty(cDevice, "Model", {
        get: function(){
            return m_sModel;
        }
    });

    return cDevice;
})();

EN.Device.SUPPORTED_OS = {
    Windows: "windows",
    MacOSX: "MacOSX",
    iOS: "iOS",
    android: "android"
};

//# sourceURL=engine/base/device.js