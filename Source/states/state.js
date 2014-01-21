/**
 * @class
 * @classdesc Represents a game state used within the StateManager state machine. Handles the loading/unloading and updating/drawing of a state
 * 
 * @constructor
 */
function State()
{
}

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
State.prototype.Enter = function(){};

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
State.prototype.Update = function(nDt){};

/**
 * Called once per frame to draw the state if it is the active state.
 */
State.prototype.Draw = function(){};

EN.State = State;
//# sourceURL=engine/states/state.js