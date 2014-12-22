var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var ceil = Math.ceil;

EN.CollisionGrid = (function(){
    
    var m_bInited = false;
    var m_aGrid = null;
    var m_nGridSize = 0;
    var m_nGridColumns = 0;
    var m_nGridRows = 0;
    var m_nMagnitude = 1;
    
    return {
        Init: function(nGridSize, nGridWidth, nGridHeight, nGridPrecision){
            nGridPrecision = isset(nGridPrecision) ? nGridPrecision : 0;
            m_nMagnitude = Math.pow(10, nGridPrecision);
            
            m_nGridSize = nGridSize;
            
            m_nGridColumns = ceil(nGridWidth * m_nMagnitude / m_nGridSize);
            m_nGridRows = ceil(nGridHeight * m_nMagnitude / m_nGridSize);
            
            m_bInited = true;
        },
        UpdateGrid: function(aGameObjects){
            if (m_bInited)
            {
                m_aGrid = Array(m_nGridColumns);

                aGameObjects.forEach(function(cGameObject){
                    var cBounds = cGameObject.Bounds.GetBounds();
                    
                    var x1 = cBounds.MinMax.x1 * m_nMagnitude;
                    var x2 = cBounds.MinMax.x2 * m_nMagnitude;
                    var y1 = cBounds.MinMax.y1 * m_nMagnitude;
                    var y2 = cBounds.MinMax.y2 * m_nMagnitude;
                    
                    var nMinColumn = max(0, floor(x1 / m_nGridSize));
                    var nMaxColumn = min(m_nGridColumns - 1, floor(x2 / m_nGridSize));
                    var nMinRow = max(0, floor(y1 / m_nGridSize));
                    var nMaxRow = min(m_nGridRows - 1, floor(y2 / m_nGridSize));

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
                            
                            m_aGrid[i][j].push(cGameObject);
                        }
                    }
                });
            }
        },
        GetPointCollision: function(cPos){
            var aGameObjects = [];
            
            var nColumnPos = floor(cPos.x / m_nGridSize);
            var nRowPos = floor(cPos.y / m_nGridSize);
            
            if (nColumnPos >= 0 && nColumnPos < m_nGridColumns && nRowPos >= 0 && nRowPos < m_nGridRows)
            {
                if (m_aGrid[nColumnPos] && m_aGrid[nColumnPos][nRowPos])
                {
                    aGameObjects = m_aGrid[nColumnPos][nRowPos];
                }
            }
            
            return aGameObjects;
        },
        IterateGrid: function(fOnCollisionGroup){
            if (m_aGrid && m_bInited)
            {
                for (var i = 0; i < m_aGrid.length; i++)
                {
                    if (m_aGrid[i])
                    {
                        for (var j = 0; j < m_aGrid[i].length; j++)
                        {
                            if (m_aGrid[i][j] && m_aGrid[i][j].length > 1)
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
