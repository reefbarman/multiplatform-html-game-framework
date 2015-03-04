//ECMAScript6

class Events
{
    constructor()
    {
        this.m_nIDs = 0;
        this.m_cEvents = {};
    }

    RegisterEvent(sEventName, fOnEvent)
    {
        if (!this.m_cEvents[sEventName])
        {
            this.m_cEvents[sEventName] = {};
        }

        this.m_cEvents[sEventName][this.m_nIDs] = fOnEvent;

        return this.m_nIDs++;
    }

    DeregisterEvent(sEventName, nID)
    {
        if (this.m_cEvents[sEventName] && this.m_cEvents[sEventName][nID])
        {
            delete this.m_cEvents[sEventName][nID];
        }
    }

    TriggerEvent(sEventName, ...aArgs)
    {
        if (this.m_cEvents[sEventName])
        {
            for (var nID in this.m_cEvents[sEventName])
            {
                this.m_cEvents[sEventName][nID](...aArgs);
            }
        }
    }
}

EN.Events = new Events();