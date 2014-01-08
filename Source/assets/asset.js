/**
 * 
 * @class
 * @constructor
 * @param {string} sFileName - The file name of the asset to load
 */
function Asset(sFileName)
{
    this.m_sFileName = sFileName;
    this.m_cPos = new Vector(0, 0);
}

Object.defineProperty(Asset.prototype, "Pos", {
    get: function(){
        return this.m_cPos;
    },
    set: function(cPos){
        this.m_cPos = cPos;
    },
    enumerable: true
});

Object.defineProperty(Asset.prototype, "FileName", {
    get: function(){
        return this.m_sFileName;
    },
    enumerable: true
});

/**
 * Load the asset and its dependencies
 *  
 * @param {Asset~OnLoadCallback} fOnLoad - Callback on assets and dependencies loaded
 */
Asset.prototype.Load = function(fOnLoad){
    fOnLoad();
};

/**
 * Update the asset
 * 
 * @param {number} nDt - The delta between this frame and last
 */
Asset.prototype.Update = function(nDt){};

/**
 * Draws the asset to the screen
 * 
 * @param {Renderer} cRenderer - The rendered to draw the asset with
 */
Asset.prototype.Draw = function(cRenderer){};

/** 
 * @callback Asset~OnLoadCallback 
 * 
 * @param {Error|undefined} cErr - An error if anything failed to load otherwise not set
 */

//# sourceURL=assets/asset.js