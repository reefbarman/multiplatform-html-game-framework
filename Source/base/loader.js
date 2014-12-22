/**
 * The loader will load anything asynchronously that exposes a load interface
 *   
 * @namespace 
 * */
EN.Loader = (function() {
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
            
            var nObjectsToLoad = 0;
            
            aObjects.forEach(function(loadable) {
                if (Array.isArray(loadable))
                {
                    nObjectsToLoad += loadable.length;
                }
                else
                {
                    nObjectsToLoad++;
                }
            });

            var fLoaded = function(cErr) {
                if (!cErr)
                {
                    nLoadedObjects++;

                    if (nLoadedObjects >= nObjectsToLoad)
                    {
                        fOnLoad();
                    }
                }
                else
                {
                    throw cErr;
                }
            };

            aObjects.forEach(function(loadable) {
                if (Array.isArray(loadable))
                {
                    loadable.forEach(function(cObject) {
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
                else
                {
                    if (isset(loadable.Load))
                    {
                        loadable.Load(fLoaded);
                    }
                    else
                    {
                        fLoaded();
                    }
                }
            });
        }
    };
})();

/** @callback Loader~OnLoadCallback */
