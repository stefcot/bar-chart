'use strict';
/**
 *
 * @type {{start}}
 */
var App = (function () {
    /**
     * Prevent from conflict
     *
     * @type {boolean}
     * @private
     */
    var _initialized = false;

    /**
     *
     * @private
     */
    var _initComponents = function () {
        App.Components.BarChart.init();
        App.Components.Popin.init();
    };

    /**
     *
     * @private
     */
    var _start = function () {
        if(!_initialized){
            App.Utils.Promise.getPromise({
                url: 'api.json',
                method:'GET',
                dataType: 'json'
            }).then(
                function(response){
                    // Storing data into the model
                    App.Model = response;
                    // Now that we have the whole story,
                    // we can initialize components
                    _initComponents();
                },
                function(errorObject){

                }
            );

            _initialized = true;
        }
    };

    /**
     * exposing methods
     */
    return {
        start: _start,
        Model : {}
    }

})();

/**
 *
 */
document.addEventListener("DOMContentLoaded", function(event) {
    App.start();
});