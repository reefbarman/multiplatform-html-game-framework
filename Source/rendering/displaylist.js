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
    this.m_aDisplayList.push(cGameObject);
};

DisplayList.prototype.Remove = function(cGameObject){
    this.m_aDisplayList.splice(this.m_aDisplayList.indexOf(cGameObject), 1);
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
//# sourceURL=engine/rendering/displaylist.js