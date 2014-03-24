EN.GameCenter = (function(){
        var m_cEjectaGameCenter = null;
        
        var m_cLeaderboardMap = {};
    
    return {
        Init: function(cLeaderboardMap){
            m_cLeaderboardMap = cLeaderboardMap;
            
            if (typeof Ejecta != "undefined" && isset(Ejecta.GameCenter))
            {
                m_cEjectaGameCenter = new Ejecta.GameCenter();
                
                //Soft authenticate inits game center and attempts to show login on first time
                m_cEjectaGameCenter.softAuthenticate(function(bErr){
                    if (bErr)
                    {
                        console.log("Game Center Authentication Failure");
                    }
                });
            }
        },
        Login: function(fOnLogin){
            if (m_cEjectaGameCenter)
            {
                m_cEjectaGameCenter.authenticate(function(bErr){
                    var cError = null;
                    
                    if (bErr)
                    {
                        console.log("Game Center Login Failure");
                        cError = new Error("Failed to Log into Game Center");
                    }
                    
                    fOnLogin(cError);
                });
            }
            else
            {
                fOnLogin();
            }
        },
        IsAuthenticated: function(){
            var bAuthenticated = false;
            
            if (m_cEjectaGameCenter)
            {
                bAuthenticated = m_cEjectaGameCenter.authed;
            }
            
            return bAuthenticated;
        },
        RecordScore: function(sLeaderboard, nScore){
            if (m_cEjectaGameCenter && isset(m_cLeaderboardMap[sLeaderboard]))
            {
                m_cEjectaGameCenter.reportScore(m_cLeaderboardMap[sLeaderboard].GameCenter, nScore, function(bError){
                    if (bError)
                    {
                        console.log("Error reporting score to Game Center Leaderboard: " + m_cLeaderboardMap[sLeaderboard].GameCenter);
                    }
                });
            }
        },
        ShowLeaderboard: function(sLeaderboard){
            if (m_cEjectaGameCenter && isset(m_cLeaderboardMap[sLeaderboard]))
            {
                m_cEjectaGameCenter.showLeaderboard(m_cLeaderboardMap[sLeaderboard].GameCenter);
            }
        }
    };
})();

//# sourceURL=engine/utilities/gamecenter.js