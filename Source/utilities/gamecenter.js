include("lib/cocoonjs/CocoonJS_Social.js", true);
include("lib/cocoonjs/CocoonJS_Social_GameCenter.js", true);
include("lib/cocoonjs/CocoonJS_Social_GooglePlayGames.js", true);

EN.GameCenter = (function(){
    
    var m_cSocialService = null;
    var m_cLeaderboardMap = null;
    
    return {
        Init: function(cLeaderboardMap){
            if (navigator.isCocoonJS)
            {
                switch (EN.Device.OS)
                {
                    case EN.Device.SUPPORTED_OS.iOS:
                        m_cSocialService = CocoonJS.Social.GameCenter.getSocialInterface();
                        break;
                    case EN.Device.SUPPORTED_OS.android:
                        CocoonJS.Social.GooglePlayGames.init({
                            clientId: EN.settings.android.applicationID
                        });
                        
                        m_cSocialService = CocoonJS.Social.GooglePlayGames.getSocialInterface();
                        break;
                }
                
                if (m_cSocialService)
                {
                    m_cLeaderboardMap = {};
                    
                    for (var sKey in cLeaderboardMap)
                    {
                        var cLeaderboards = cLeaderboardMap[sKey];
                        
                        if (isset(cLeaderboards[EN.Device.OS]))
                        {
                            m_cLeaderboardMap[sKey] = cLeaderboards[EN.Device.OS];
                        }
                    }
                    
                    m_cSocialService.login(function(bAuthenticated, cErr){});
                }
            }
        },
        ShowLeaderboard: function(sLeaderboard){
            if (m_cSocialService && m_cSocialService.isLoggedIn() && isset(m_cLeaderboardMap[sLeaderboard]))
            {
                m_cSocialService.showLeaderboard(function(){}, {leaderboardID: m_cLeaderboardMap[sLeaderboard]});
            }
        },
        PostScore: function(sLeaderboard, nScore){
            if (m_cSocialService && m_cSocialService.isLoggedIn() && isset(m_cLeaderboardMap[sLeaderboard]))
            {
                m_cSocialService.submitScore(nScore, function(){}, {leaderboardID: m_cLeaderboardMap[sLeaderboard]});
            }
        }
    };
})();
