function DisplayList()
{
    this.m_aDisplayList = [];
}

DisplayList.prototype.Add = function(cGameObject){
    this.m_aDisplayList.push(cGameObject);
};

DisplayList.prototype.Remove = function(cGameObject){
    this.m_aDisplayList.splice(this.m_aDisplayList.indexOf(cGameObject), 1);
};

DisplayList.prototype.Draw = function(cRenderer){
    this.m_aDisplayList.sort(function(a, b){
        return a.zIndex - b.zIndex;
    });

    this.m_aDisplayList.forEach(function(cGameObject){
        cGameObject.Draw(cRenderer);
    });
};

EN.DisplayList = DisplayList;
//# sourceURL=engine/rendering/displaylist.js