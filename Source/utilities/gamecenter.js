include("lib/cocoonjs/CocoonJS_Social.js", true);
include("lib/cocoonjs/CocoonJS_Social_GameCenter.js", true);

EN.GameCenter = (function(){
    
    var m_cSocialService = null;
    
    return {
        Init: function(){
            if (navigator.isCocoonJS)
            {
                m_cSocialService = CocoonJS.Social.GameCenter.getSocialInterface();

                m_cSocialService.login(function(bAuthenticated, cErr){});
            }
        },
        ShowLeaderboard: function(sLeaderboard){
            if (m_cSocialService && m_cSocialService.isLoggedIn())
            {
                m_cSocialService.showLeaderboard(function(){}, {leaderboardID: sLeaderboard});
            }
        },
        PostScore: function(sLeaderboard, nScore){
            if (m_cSocialService)
            {
                m_cSocialService.submitScore(nScore, function(){}, {leaderboardID: sLeaderboard});
            }
        }
    };
})();

//# sourceURL=engine/utilities/gamecenter.js