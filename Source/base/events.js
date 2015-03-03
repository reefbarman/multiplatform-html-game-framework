//ECMAScript6

class Events
{
    constructor()
    {
        this.m_cEvents = {};
    }

    RegisterEvent(sEventName, fOnEvent)
    {
        if (!this.m_cEvents[sEventName])
        {
            this.m_cEvents[sEventName] = [];
        }

        this.m_cEvents[sEventName].push(fOnEvent);
    }

    DeregisterEvent(sEventName, fOnEvent)
    {
        if (this.m_cEvents[sEventName])
        {
            var nIndex = this.m_cEvents[sEventName].indexOf(fOnEvent);

            this.m_cEvents[sEventName].splice(nIndex, 1);
        }
    }

    TriggerEvent(sEventName, ...aArgs)
    {
        if (this.m_cEvents[sEventName])
        {
            this.m_cEvents.forEach(function(fEvent){
                fEvent(...aArgs);
            });
        }
    }
}

EN.Events = new Events();