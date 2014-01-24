function Console()
{
    var m_$Console = null;
    var m_$DragBar = null;
    
    var m_$ControlBar = null;
    
    var m_$LogContainer = null;
    var m_$Log = null;
    
    var m_bTail = false;
    
    function Init()
    {
        m_$Console = $("<div>").addClass("cPG_Console");
        
        m_$ControlBar = $("<div>").addClass("cPG_ConsoleControlBar cPG_ControlBar").append(
            $("<div>").append(
                $("<label>").text("Tail Log: "),
                $("<input>").attr({"type": "checkbox"}).change(function(){
                    m_bTail = $(this).is(":checked");
                })
            )
        );
        
        m_$LogContainer = $("<div>").addClass("cPG_ConsoleLog");
        m_$Log = $("<aside>");
        
        m_$DragBar = $("<div>").addClass("cPG_ConsoleDragBar").mousedown(function(e){
            e.preventDefault();

            var nStartX = e.pageX;
            var nWidth = m_$Console.width();
            
            var $Parents = m_$DragBar.parents();
            
            var fOnMouseMove = function(e){
                m_$Console.width(nWidth + (nStartX - e.pageX));
            };
            
            var fOnMouseUp = function(){
                $Parents.unbind("mousemove", fOnMouseMove);
                $Parents.unbind("mouseup", fOnMouseUp);
                m_$DragBar.unbind("mouseup", fOnMouseUp);
            };
                    
            $Parents.mousemove(fOnMouseMove);
            $Parents.mouseup(fOnMouseUp);
            
            m_$DragBar.mouseup(fOnMouseUp);
            
            return false;
        });
        
        m_$Console.append(
            m_$DragBar,
            m_$ControlBar,
            m_$LogContainer.append(
                m_$Log
            )
        );

        EventDispatcher.Bind("WindowResize", function(nControlBarHeight){
            m_$Console.height($(document.body).height() - nControlBarHeight);
            m_$LogContainer.height(m_$Console.height() - m_$ControlBar.outerHeight());
        });

        EventDispatcher.Bind("Console", UpdateLog);
    }
    
    function UpdateLog(cLogging)
    {
        var $Element = $("<p>").addClass("cPG_ConsoleLogLevel" + cLogging.level);

        for (var i in cLogging.args)
        {
            var val = cLogging.args[i];
            var sTypeOf = typeof val;

            var formattedVal = "LOG ERROR";

            switch (sTypeOf)
            {
                case "object":
                    formattedVal = $("<pre>").text(JSON.stringify(val, null, 2));
                    break;
                default:
                    formattedVal = val;
                    break;
            }

            if (i > 0)
            {
                $Element.append(", ");
            }

            $Element.append(formattedVal);
        }

        m_$Log.append($Element);

        if (m_bTail)
        {
            m_$Log.parent().scrollTop(m_$Log.get(0).scrollHeight);
        }
    }
    
    this.Show = function(){
        $("body").append(m_$Console);
    };
    
    this.Hide = function(){
        m_$Console.detach();
    };
    
    Init();
}

