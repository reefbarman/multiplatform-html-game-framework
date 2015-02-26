var s_fSortFunction = function(a, b){
    return a.zIndex - b.zIndex;
};

function DisplayList()
{
    this.m_aDisplayList = [];
}

DisplayList.SetSortFunction = function(fSort){
    s_fSortFunction = fSort;
};

DisplayList.prototype.Add = function(cGameObject){
    if (this.m_aDisplayList.indexOf(cGameObject) == -1)
    {
        this.m_aDisplayList.push(cGameObject);
    }
};

DisplayList.prototype.Remove = function(cGameObject){
    var nIndex = this.m_aDisplayList.indexOf(cGameObject);

    if (nIndex >= 0)
    {
        this.m_aDisplayList.splice(nIndex, 1);
    }
};

DisplayList.prototype.Draw = function(cRenderer){
    this.m_aDisplayList.sort(s_fSortFunction);
    this.m_aDisplayList.forEach(function(cGameObject){
        if (cGameObject.Active)
        {
            cGameObject.Draw(cRenderer);
        }
    });
};

EN.DisplayList = DisplayList;
