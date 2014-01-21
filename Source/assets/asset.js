include("rendering/drawable.js", true);

/**
 * 
 * @class
 * @constructor
 * @param {string} sFileName - The file name of the asset to load
 * 
 * @extends Asset
 */
function Asset(sFileName)
{
    //super constructor
    EN.Drawable.call(this);
    
    this.m_sFileName = sFileName;
}

inherits(Asset, EN.Drawable);

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
 * @callback Asset~OnLoadCallback 
 * 
 * @param {Error|undefined} cErr - An error if anything failed to load otherwise not set
 */

EN.Asset = Asset;
//# sourceURL=engine/assets/asset.js