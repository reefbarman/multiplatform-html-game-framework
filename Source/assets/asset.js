include("game/gameobject.js", true);

/**
 * 
 * @class
 * @constructor
 * @param {string} sFileName - The file name of the asset to load
 */
function Asset(sFileName)
{
    this._GameObject();

    this.m_sFileName = sFileName;
}

inherits(Asset, EN.GameObject);

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
 * @callback Asset~OnLoadCallback 
 * 
 * @param {Error|undefined} cErr - An error if anything failed to load otherwise not set
 */

EN.Asset = Asset;
