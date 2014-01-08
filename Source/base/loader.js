/**
 * The loader will load anything asynchronously that exposes a load interface
 *   
 * @namespace 
 * */
var Loader = (function() {
    /** @lends Loader */
    return {
        /**
         * Load passed objects
         * 
         * @param {object[]} aObjects - An array of objects to load
         * @param {Loader~OnLoadCallback} fOnLoad - Called when all the passed objects and their dependencies are loaded
         */
        Load: function(aObjects, fOnLoad) {
            var nLoadedObjects = 0;

            var fLoaded = function(cErr) {
                if (!cErr)
                {
                    nLoadedObjects++;

                    if (nLoadedObjects >= aObjects.length)
                    {
                        fOnLoad();
                    }
                }
                else
                {
                    throw cErr;
                }
            };

            aObjects.forEach(function(cObject) {
                if (isset(cObject.Load))
                {
                    cObject.Load(fLoaded);
                }
                else
                {
                    fLoaded();
                }
            });
        }
    };
})();

/** @callback Loader~OnLoadCallback */

//# sourceURL=base/loader.js