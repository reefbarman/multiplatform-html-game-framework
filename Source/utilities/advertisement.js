include("lib/cocoonjs/CocoonJS_Ad.js", true);

EN.Advertisement = (function(){
    
    var m_bBannerHidden = true;
    var m_sLastLocation = CocoonJS.Ad.BannerLayout.TOP_CENTER;
    
    return {
        Init: function(){
            CocoonJS.Ad.onBannerShown.addEventListener(function(){
                m_bBannerHidden = false;
            });

            CocoonJS.Ad.onBannerHidden.addEventListener(function(){
                m_bBannerHidden = true;
            });

            CocoonJS.Ad.onBannerReady.addEventListener(function(width,height){
                CocoonJS.Ad.setBannerLayout(m_sLastLocation);
            });
            
            CocoonJS.Ad.preloadBanner();
        },
        Show: function(sLocation){
            if (m_bBannerHidden)
            {
                m_sLastLocation = sLocation;
                CocoonJS.Ad.setBannerLayout(sLocation);
                CocoonJS.Ad.showBanner();
            }
        },
        Hide: function(){
            if (!m_bBannerHidden)
            {
                CocoonJS.Ad.hideBanner();
            }
        },
        LOCATION: {
            TOP: CocoonJS.Ad.BannerLayout.TOP_CENTER,
            BOTTOM: CocoonJS.Ad.BannerLayout.BOTTOM_CENTER
        }
    };
})();

//# sourceURL=engine/utilities/advertisement.js