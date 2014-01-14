var CollisionGrid = (function(){
    
    var m_bInited = false;
    var m_aGrid = null;
    var m_nGridSize = 0;
    var m_nGridColumns = 0;
    var m_nGridRows = 0;
    
    return {
        Init: function(nGridSize, nGridWidth, nGridHeight){
            m_nGridSize = nGridSize;
            
            m_nGridColumns = Math.ceil(nGridWidth / m_nGridSize);
            m_nGridRows = Math.ceil(nGridHeight / m_nGridSize);
            
            m_bInited = true;
        },
        UpdateGrid: function(aEntities){
            if (m_bInited)
            {
                m_aGrid = Array(m_nGridColumns);

                aEntities.forEach(function(cEntity){
                    var cBounds = cEntity.GetBounds();

                    var nMinColumn = Math.max(0, Math.floor(cBounds.x1 / m_nGridSize));
                    var nMaxColumn = Math.min(m_nGridColumns - 1, Math.floor(cBounds.x2 / m_nGridSize));
                    var nMinRow = Math.max(0, Math.floor(cBounds.y1 / m_nGridSize));
                    var nMaxRow = Math.min(m_nGridRows - 1, Math.floor(cBounds.y2 / m_nGridSize));

                    for (var i = nMinColumn; i <= nMaxColumn; i++)
                    {
                        if (!m_aGrid[i])
                        {
                            m_aGrid[i] = Array(m_nGridRows);
                        }
                        
                        for (var j = nMinRow; j <= nMaxRow; j++)
                        {
                            if (!m_aGrid[i][j])
                            {
                                m_aGrid[i][j] = [];
                            }
                            
                            m_aGrid[i][j].push(cEntity);
                        }
                    }
                });
            }
        },
        GetPointCollision: function(cPos){
            var aEntities = [];
            
            var nColumnPos = Math.floor(cPos.x / m_nGridSize);
            var nRowPos = Math.floor(cPos.y / m_nGridSize);
            
            if (nColumnPos >= 0 && nColumnPos < m_nGridColumns && nRowPos >= 0 && nRowPos < m_nGridRows)
            {
                if (m_aGrid[nColumnPos] && m_aGrid[nColumnPos][nRowPos])
                {
                    aEntities = m_aGrid[nColumnPos][nRowPos];
                }
            }
            
            return aEntities;
        },
        IterateGrid: function(fOnCollisionGroup){
            if (m_aGrid)
            {
                for (var i = 0; i < m_aGrid.length; i++)
                {
                    if (m_aGrid[i])
                    {
                        for (var j = 0; j < m_aGrid[i].length; j++)
                        {
                            if (m_aGrid[i][j])
                            {
                                fOnCollisionGroup(m_aGrid[i][j]);
                            }
                        }
                    }
                }
            }
        }
    };
})();

//# sourceURL=collision/collisiongrid.js