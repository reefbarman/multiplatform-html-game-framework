function UIHandler()
{
    var m_$ControlBar = null;
    var m_$ConsoleLog = null;
    
    function Init()
    {
        m_$ControlBar = $("#iCQ_ControlBar");
        m_$ConsoleLog = $("#iCQ_ConsoleLog");
        
        UIResize();
        HandleConsoleResize();
    }
    
    function UIResize()
    {
        var $Window = $(window);
        m_$ConsoleLog.height($Window.height() - m_$ControlBar.height());
    }
    
    function HandleConsoleResize()
    {
        var $DragBar = m_$ConsoleLog.find(".cCQ_DragBar");
                
        $DragBar.mousedown(function(e){
            e.preventDefault();

            var nStartX = e.pageX;
            var nWidth = m_$ConsoleLog.width();
            
            var $Parents = $DragBar.parents();
            
            var fOnMouseMove = function(e){
                m_$ConsoleLog.width(nWidth + (nStartX - e.pageX));
            };
            
            var fOnMouseUp = function(){
                $Parents.unbind("mousemove", fOnMouseMove);
                $Parents.unbind("mouseup", fOnMouseUp);
                $DragBar.unbind("mouseup", fOnMouseUp);
            };
                    
            $Parents.mousemove(fOnMouseMove);
            $Parents.mouseup(fOnMouseUp);
            
            $DragBar.mouseup(fOnMouseUp);
            
            return false;
        });
    }
    
    Init();
}