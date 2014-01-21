exports = {
    /**
     * Tests a non global value to see if its defined
     * 
     * @param {*} value - the value to test if defined
     * 
     * @returns {Boolean} - true|false if the value is set
     */
    isset: function(value){
        return typeof value != "undefined";
    },
    
    /**
     * Parses the query param string on the window url
     * 
     * @returns {object} - a map of any params found
     */
    parseQueryParams: function(){
        var cParams = {};

        var sQueryString = window.location.search;

        if (sQueryString)
        {
            var aQueryParams = sQueryString.substring(1).split("&");

            aQueryParams.forEach(function(sQueryParam){
                var aParts = sQueryParam.split("=");
                cParams[aParts[0]] = aParts[1];
            });
        }

        return cParams;
    },
    
    /**
     * Extend an object with other objects
     * Thanks to 
     *      stackoverflow http://stackoverflow.com/questions/9399365/deep-extend-like-jquerys-for-nodejs
     *      jQuery https://github.com/jquery/jquery/blob/master/src/core.js
     * 
     * @returns {object} - the extended target
     */
    extend: function(){
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false,
                toString = Object.prototype.toString,
                hasOwn = Object.prototype.hasOwnProperty,
                push = Array.prototype.push,
                slice = Array.prototype.slice,
                trim = String.prototype.trim,
                indexOf = Array.prototype.indexOf,
                class2type = {
            "[object Boolean]": "boolean",
            "[object Number]": "number",
            "[object String]": "string",
            "[object Function]": "function",
            "[object Array]": "array",
            "[object Date]": "date",
            "[object RegExp]": "regexp",
            "[object Object]": "object"
        },
        jQuery = {
            isFunction: function(obj) {
                return jQuery.type(obj) === "function";
            },
            isArray: Array.isArray ||
                    function(obj) {
                        return jQuery.type(obj) === "array";
                    },
            isWindow: function(obj) {
                return obj != null && obj == obj.window;
            },
            isNumeric: function(obj) {
                return !isNaN(parseFloat(obj)) && isFinite(obj);
            },
            type: function(obj) {
                return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
            },
            isPlainObject: function(obj) {
                if (!obj || jQuery.type(obj) !== "object" || obj.nodeType) {
                    return false;
                }
                try {
                    if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                        return false;
                    };
                } catch (e) {
                    return false;
                }
                var key;
                for (key in obj) {
                }
                return key === undefined || hasOwn.call(obj, key)
            }
        };
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }
        if (typeof target !== "object" && !jQuery.isFunction(target)) {
            target = {}
        }
        if (length === i) {
            target = this;
            --i;
        }
        for (i; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue
                    }
                    if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : []
                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }
                        // WARNING: RECURSION
                        target[name] = extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    },
    
    /**
     * 
     * @callback AjaxCompleteCallback
     * 
     * @param {Error} cErr
     * @param {*} response
     */

    /**
     * Run an ajax request for a resource
     * 
     * @param {object} cOptions
     * @param {string} cOptions.src - the url to load
     * @param {AjaxCompleteCallback} cOptions.onComplete - callback on success or failure
     * @param {string} cOptions.type - GET | POST for request type
     * 
     */
    ajaxLoad: function(cOptions){
        var cDefaults = {
            src: null,
            onComplete: function(){},
            type: "GET",
            dataType: "json"
        };

        cOptions = extend({}, cDefaults, cOptions);

        if (cOptions.src)
        {
            var cRequest = new XMLHttpRequest();

            cRequest.onreadystatechange = function(){
                if (cRequest.readyState == 4)
                {
                    if (cRequest.status == 200)
                    {
                        var value = cRequest.response;

                        switch (cOptions.dataType)
                        {
                            case "json":
                                try
                                {
                                    cOptions.onComplete(null, JSON.parse(value));
                                }
                                catch (e)
                                {
                                    cOptions.onComplete(e);
                                }

                                break
                            default:
                                cOptions.onComplete(null, value);
                                break;
                        }
                    }
                    else
                    {
                        var cError = new Error("Failed GET request with status " + cRequest.status + " at url: " + cOptions.src);
                        cOptions.onComplete(cError);
                    }
                }
            };

            cRequest.open("GET", cOptions.src, true);
            cRequest.send();
        }
        else
        {
            cOptions.onComplete(new Error("Missing source parameter"));
        }
    },
    
    inherits: function(child, parent){
        function Inherited(){};
        Inherited.prototype = parent.prototype;

        child.prototype = new Inherited();
        child.prototype.constructor = child;
    }
};

//# sourceURL=engine/base/base.js