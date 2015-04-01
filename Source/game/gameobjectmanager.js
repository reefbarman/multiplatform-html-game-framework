//ECMAScript6
include("rendering/displaylist.js", true);

class GameObjectManager
{
    constructor()
    {
        this.m_aGameObjects = [];

        this.m_cDisplayLists = {};
    }

    RegisterGameObject(cGameObject)
    {
        if (this.m_aGameObjects.indexOf(cGameObject) == -1)
        {
            this.m_aGameObjects.push(cGameObject);
        }

        if (cGameObject.Renderable)
        {
            this.RegisterRenderable(cGameObject);
        }
    }

    DeregisterGameObject(cGameObject)
    {
        var nIndex = this.m_aGameObjects.indexOf(cGameObject);

        if (nIndex != -1)
        {
            this.m_aGameObjects.splice(nIndex, 1);
        }

        if (cGameObject.__DisplayList)
        {
            cGameObject.__DisplayList.Remove(cGameObject);
        }
    }

    RegisterRenderable(cGameObject)
    {
        if (!this.m_cDisplayLists[cGameObject.camera])
        {
            this.m_cDisplayLists[cGameObject.camera] = new EN.DisplayList();
        }

        this.m_cDisplayLists[cGameObject.camera].Add(cGameObject);
        cGameObject.__DisplayList = this.m_cDisplayLists[cGameObject.camera];
    }

    CameraChange(cGameObject)
    {
        if (cGameObject.__DisplayList)
        {
            cGameObject.__DisplayList.Remove(cGameObject);
        }

        if (cGameObject.Renderable)
        {
            if (!this.m_cDisplayLists[cGameObject.camera])
            {
                this.m_cDisplayLists[cGameObject.camera] = new EN.DisplayList();
            }

            this.m_cDisplayLists[cGameObject.camera].Add(cGameObject);
            cGameObject.__DisplayList = this.m_cDisplayLists[cGameObject.camera];
        }
    }

    Update()
    {
        this.m_aGameObjects.forEach(function(cGameObject){
            if (cGameObject.Active)
            {
                cGameObject.Update();
            }
        });
    }

    Draw(cRenderer)
    {
        for (var sCamera in this.m_cDisplayLists)
        {
            this.m_cDisplayLists[sCamera].Draw(cRenderer);
        }
    }
}

EN.GameObjectManager = new GameObjectManager();