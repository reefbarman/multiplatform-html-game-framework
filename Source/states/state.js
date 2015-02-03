include("game/camera.js", true);
include("collision/collisionsystem.js", true);
include("rendering/displaylist.js", true);
/**
 * @class
 * @classdesc Represents a game state used within the StateManager state machine. Handles the loading/unloading and updating/drawing of a state
 * 
 * @constructor
 */
function State(sName)
{
    this.Name = sName;
    this.m_aChildren = [];
    
    this.m_cDisplayList = new EN.DisplayList();
    this.m_cUIDisplayList = new EN.DisplayList();
    
    this.m_cCamera = new EN.Camera(this.Name);
    this.m_cUICamera = new EN.Camera(this.Name + "UICam");
}

State.prototype.AddChild = function(cChild, bInit){
    bInit = isset(bInit) ? bInit : true;

    cChild.__DisplayList = this.m_cDisplayList;
    this.m_aChildren.push(cChild);

    if (cChild.Renderable)
    {
        this.m_cDisplayList.Add(cChild);
    }

    if (bInit)
    {
        cChild.Init();
    }
};

State.prototype.RemoveChild = function(cChild){
    if (cChild.Renderable)
    {
        this.m_cDisplayList.Remove(cChild);
    }

    cChild.__DisplayList = null;
    this.m_aChildren.splice(this.m_aChildren.indexOf(cChild), 1);
};

State.prototype.AddUI = function(cUIElement){
    cUIElement.__DisplayList = this.m_cUIDisplayList;

    this.m_aChildren.push(cUIElement);
    this.m_cUIDisplayList.Add(cUIElement);
};

State.prototype.RemoveUI = function(cUIElement){
    this.m_cUIDisplayList.Remove(cUIElement);
    cUIElement.__DisplayList = null;
    this.m_aChildren.splice(this.m_aChildren.indexOf(cUIElement), 1);
};

State.prototype.UpdateState = function(){
    this.m_cCamera.Update();
    this.m_cUICamera.Update();

    this.Update();

    this.m_aChildren.forEach(function(cChild){
        cChild.UpdateGameObject();
    });

    EN.CollisionSystem.Update();
};

/**
 * Loads the state and all its dependencies
 * 
 * @param {State~OnLoadCallback} fOnLoad - The callback to call when the state is finished loading
 */
State.prototype.Load = function(fOnLoad){
    fOnLoad();
};

/**
 * Called when the state is entered after loading. Any initialization post loading and before state updates should be done here
 */
State.prototype.Enter = function(){
    this.m_cCamera.Init(EN.Game.Viewport.Height);
    this.m_cUICamera.Init(EN.Game.Viewport.Height, false);

    EN.CameraManager.Push(this.m_cCamera);
};

/**
 * Called when the state exits. Cleanup of the state and its assets should be done here.
 */
State.prototype.Exit = function(){
    EN.CameraManager.Pop(this.m_cCamera);
};

/**
 * Called when the state is popped back on to the top of the state stack. Use to reinitialize anything prior to updating beginning again.
 */
State.prototype.Resume = function(){};

/**
 * Called when the state is made inactive by a new state being pushed onto the stack. Use to handle cleanup or state saving.
 */
State.prototype.Pause = function(){};

/**
 * Called once per frame to update the frame if it is the active state.
 */
State.prototype.Update = function(){};

/**
 * Called once per frame to draw the state if it is the active state.
 */
State.prototype.Draw = function(cRenderer){
    this.m_cDisplayList.Draw(cRenderer);

    EN.CameraManager.Push(this.m_cUICamera);
    this.m_cUIDisplayList.Draw(cRenderer);
    EN.CameraManager.Pop();
};

EN.State = State;
