function FPSMeter()
{
    var m_$Meter = null;
    
    function Init()
    {
        m_$Meter = $("<div>").addClass("cPG_FPSMeter");
        
        EventDispatcher.Bind("FPS", UpdateFPS);
    }
    
    function UpdateFPS(nFrameDelta)
    {
        m_$Meter.text(Math.round(1000 / nFrameDelta) + " FPS");
    }
    
    this.Show = function(){
        $("body").append(m_$Meter);
    };
    
    this.Hide = function(){
        m_$Meter.detach();
    };
    
    Init();
}