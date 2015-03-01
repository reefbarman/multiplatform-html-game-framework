//ECMAScript6

var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var ceil = Math.ceil;

class CollisionGrid
{
    constructor()
    {
        this.m_bInited = false;
        this.m_aGrid = null;
        this.m_nCellSize = 0;
        this.m_nGridColumns = 0;
        this.m_nGridRows = 0;
    }

    Init(nGridWidth, nGridHeight, nCellSize)
    {
        this.m_nCellSize = nCellSize;

        this.m_nGridColumns = ceil(nGridWidth / this.m_nCellSize);
        this.m_nGridRows = ceil(nGridHeight / this.m_nCellSize);

        this.m_bInited = true;
    }

    UpdateGrid(aGameObjects)
    {
        var self = this;

        if (this.m_bInited)
        {
            this.m_aGrid = Array(this.m_nGridColumns);

            aGameObjects.forEach(function(cGameObject){
                var cBounds = cGameObject.Bounds.GetBounds();

                var x1 = cBounds.MinMax.x1;
                var x2 = cBounds.MinMax.x2;
                var y1 = cBounds.MinMax.y1;
                var y2 = cBounds.MinMax.y2;

                var nMinColumn = max(0, floor(x1 / self.m_nCellSize));
                var nMaxColumn = min(self.m_nGridColumns - 1, floor(x2 / self.m_nCellSize));
                var nMinRow = max(0, floor(y1 / self.m_nCellSize));
                var nMaxRow = min(self.m_nGridRows - 1, floor(y2 / self.m_nCellSize));

                for (var i = nMinColumn; i <= nMaxColumn; i++)
                {
                    if (!self.m_aGrid[i])
                    {
                        self.m_aGrid[i] = Array(self.m_nGridRows);
                    }

                    for (var j = nMinRow; j <= nMaxRow; j++)
                    {
                        if (!self.m_aGrid[i][j])
                        {
                            self.m_aGrid[i][j] = [];
                        }

                        self.m_aGrid[i][j].push(cGameObject);
                    }
                }
            });
        }
    }

    GetObjectsAtPoint(cPos)
    {
        var aGameObjects = [];

        if (this.m_bInited && this.m_aGrid)
        {
            var nColumnPos = floor(cPos.x / this.m_nCellSize);
            var nRowPos = floor(cPos.y / this.m_nCellSize);

            if (nColumnPos >= 0 && nColumnPos < this.m_nGridColumns && nRowPos >= 0 && nRowPos < this.m_nGridRows)
            {
                if (this.m_aGrid[nColumnPos] && this.m_aGrid[nColumnPos][nRowPos])
                {
                    aGameObjects = this.m_aGrid[nColumnPos][nRowPos];
                }
            }
        }

        return aGameObjects;
    }

    IterateGrid(fOnCollisionGroup)
    {
        if (this.m_bInited && this.m_aGrid)
        {
            for (var i = 0; i < this.m_aGrid.length; i++)
            {
                if (this.m_aGrid[i])
                {
                    for (var j = 0; j < this.m_aGrid[i].length; j++)
                    {
                        if (this.m_aGrid[i][j] && this.m_aGrid[i][j].length > 1)
                        {
                            fOnCollisionGroup(this.m_aGrid[i][j]);
                        }
                    }
                }
            }
        }
    }
}

EN.CollisionGrid = new CollisionGrid();