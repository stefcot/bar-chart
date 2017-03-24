'use strict';
var App = App || {};
App.Utils = App.Utils || {};

/**
 *
 * @type {Object}
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
     *
     *
     * @param tmpl_name guess what
     * @param tmpl_data JSON object to populate fragment
     * @param tmpl_dir URI served by Sling to the proper HTML fragment resource
     *
     * @private
     *
     * @returns {*}
     */
    var _template = function (tmpl_name, tmpl_data, tmpl_dir) {
        var dir = tmpl_dir || '',
            url = dir !== '' ? (dir + '/' + tmpl_name + '.html') : (tmpl_name + '.html');

        if ( !_tmpl_cache ) { _tmpl_cache = {};}

        // Checks whether template already exists.
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