'use strict';
var App = App || {};
App.Utils = App.Utils || {};
/**
 * Module template, singleton pattern
 */
App.Utils.Templates = (function() {
    /**
     * Object meant to store different loaded templates from relative directories.
     *
     * @type {Object}
     * @private
     */
    var _tmpl_cache = {};

    /**
     * Return a Promise wrapping the original promise loading the content,
     * allows exterior reception of the content through this very wrapping promise.
     *
     * @param tmpl_name {string} template name
     * @param tmpl_data {Object} JSON object to populate fragment (not required)
     * @param tmpl_dir {string} URI served by Sling to the proper HTML fragment resource
     *
     * @private
     * @returns {*}
     */
    var _template = function (tmpl_name, tmpl_data, tmpl_dir) {
        var dir = tmpl_dir || '',
            url = dir !== '' ? (dir + '/' + tmpl_name + '.html') : (tmpl_name + '.html');
        // Checks whether template entry already exists
        if ( ! _tmpl_cache[tmpl_name] ) {
            return App.Utils.Promise.getPromise({
                    url: url,
                    method:'GET',
                    dataType: 'text'
                }).then(
                    function(response){
                        _tmpl_cache[tmpl_name] = response;

                        return new Promise(function(resolve) {
                            setTimeout(function() {
                                resolve(_tmpl_cache[tmpl_name]);
                            }, 1);
                        });
                    },
                    function(errorObject){}
                );
        }
        // If so returning the string template through
        // a wrapping promise by resolving it.
        return new Promise(function(resolve) {
            setTimeout(function() {
                resolve(_tmpl_cache[tmpl_name]);
            }, 1);
        });
    };

    /**
     * Exposing methods
     */
    return {
        getTemplate: _template
    }
})();