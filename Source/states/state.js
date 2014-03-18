include("game/camera.js", true);
include("collision/collisionsystem.js", true);
/**
 * @class
 * @classdesc Represents a game state used within the StateManager state machine. Handles the loading/unloading and updating/drawing of a state
 * 
 * @constructor
 */
function State(sName)
{
    this.Name = sName;
    this.m_cChildren = {};
    this.m_nChildren = 0;
    
    this.m_cDisplayList = new EN.DisplayList();
    this.m_cUIDisplayList = new EN.DisplayList();
    
    this.m_cCamera = new EN.Camera(this.Name);
    this.m_cUICamera = new EN.Camera(this.Name + "UICam");
}

State.prototype.__InitialUpdate = function(nDt){
    for (var nChild in this.m_cChildren)
    {
        this.m_cChildren[nChild].InitialUpdate(nDt);
    }
};

State.prototype.__FinalUpdate = function(nDt){
    for (var nChild in this.m_cChildren)
    {
        this.m_cChildren[nChild].FinalUpdate(nDt);
    }
};

State.prototype.AddChild = function(cChild){
    cChild.__ChildID = this.m_nChildren;
    cChild.__Parent = this;
    this.m_cChildren[this.m_nChildren++] = cChild;
    this.m_cDisplayList.Add(cChild);
};

State.prototype.RemoveChild = function(cChild){
    this.m_cDisplayList.Remove(cChild);
    cChild.__Parent = null;
    delete this.m_cChildren[cChild.__ChildID];
};

State.prototype.AddUI = function(cUIElement){
    cUIElement.__ChildID = this.m_nChildren;
    cUIElement.__Parent = this;
    this.m_cChildren[this.m_nChildren++] = cUIElement;
    this.m_cUIDisplayList.Add(cUIElement);
};

State.prototype.RemoveUI = function(cUIElement){
    this.m_cUIDisplayList.Remove(cUIElement);
    cUIElement.__Parent = null;
    delete this.m_cChildren[cUIElement.__ChildID];
};

State.prototype.GetDisplayList = function(){
    return this.m_cDisplayList;
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
    this.m_cCamera.Init();
    this.m_cUICamera.Init(false);
};

/**
 * Called when the state exits. Cleanup of the state and its assets should be done here.
 */
State.prototype.Exit = function(){};

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
 * 
 * @param {number} nDt - The delta time between this frame and last.
 */
State.prototype.Update = function(nDt){
    EN.CameraManager.Push(this.m_cCamera);
    
    this.__InitialUpdate(nDt);
    
    this.m_cCamera.Update(nDt);
    this.m_cUICamera.Update(nDt);
    
    for (var nChild in this.m_cChildren)
    {
        this.m_cChildren[nChild].UpdateTransform();
    }
    
    EN.CollisionSystem.Update(nDt);
    
    this.__FinalUpdate(nDt);
    
    EN.CameraManager.Pop();
};

/**
 * Called once per frame to draw the state if it is the active state.
 */
State.prototype.Draw = function(cRenderer){
    EN.CameraManager.Push(this.m_cCamera);
    this.m_cDisplayList.Draw(cRenderer);
    EN.CameraManager.Pop();
    
    EN.CameraManager.Push(this.m_cUICamera);
    this.m_cUIDisplayList.Draw(cRenderer);
    EN.CameraManager.Pop();
};

EN.State = State;
//# sourceURL=engine/states/state.js