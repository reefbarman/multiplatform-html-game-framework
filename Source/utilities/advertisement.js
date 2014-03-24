EN.Advertisement = (function(){
    var m_cEjectaIAdInstance = null;
    
    return {
        Init: function(){
            if (typeof Ejecta != "undefined" && isset(Ejecta.AdBanner))
            {
                m_cEjectaIAdInstance = new Ejecta.AdBanner();
            }
        },
        Show: function(sLocation){
            if (m_cEjectaIAdInstance)
            {
                m_cEjectaIAdInstance.isAtBottom = sLocation == EN.Advertisement.LOCATION.BOTTOM ? true : false;
                m_cEjectaIAdInstance.show();
            }
        },
        Hide: function(){
            if (m_cEjectaIAdInstance)
            {
                m_cEjectaIAdInstance.hide();
            }
        },
        LOCATION: {
            TOP: "top",
            BOTTOM: "bottom"
        }
    };
})();

//# sourceURL=engine/utilities/advertisement.js