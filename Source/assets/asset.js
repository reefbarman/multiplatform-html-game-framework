//ECMAScript6

include("game/gameobject.js", true);

class Asset extends EN.GameObject
{
    constructor(sFileName)
    {
        super();

        this.m_sFileName = sFileName;
    }

    get FileName()
    {
        return this.m_sFileName;
    }

    Load(fOnLoad)
    {
        fOnLoad();
    }
}

EN.Asset = Asset;
